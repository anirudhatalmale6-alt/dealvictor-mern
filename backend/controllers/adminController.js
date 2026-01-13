const User = require('../models/User');
const Project = require('../models/Project');
const Order = require('../models/Order');
const Service = require('../models/Service');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Settings = require('../models/Settings');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    const [
      totalUsers,
      newUsersThisMonth,
      totalProjects,
      activeProjects,
      totalOrders,
      completedOrders,
      totalServices,
      totalProducts,
      revenueData
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Project.countDocuments(),
      Project.countDocuments({ status: 'open' }),
      Order.countDocuments(),
      Order.countDocuments({ status: 'completed' }),
      Service.countDocuments({ isActive: true }),
      Product.countDocuments({ isActive: true }),
      Order.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$platformFee' } } }
      ])
    ]);

    // Recent activity
    const recentUsers = await User.find()
      .sort('-createdAt')
      .limit(5)
      .select('name email createdAt avatar');

    const recentOrders = await Order.find()
      .sort('-createdAt')
      .limit(5)
      .populate('buyer', 'name')
      .populate('seller', 'name')
      .select('orderNumber price status createdAt');

    const recentProjects = await Project.find()
      .sort('-createdAt')
      .limit(5)
      .populate('client', 'name')
      .select('title budget status createdAt');

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          newUsersThisMonth,
          totalProjects,
          activeProjects,
          totalOrders,
          completedOrders,
          totalServices,
          totalProducts,
          totalRevenue: revenueData[0]?.total || 0
        },
        recentActivity: {
          users: recentUsers,
          orders: recentOrders,
          projects: recentProjects
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats',
      error: error.message
    });
  }
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      role,
      status,
      sort = '-createdAt'
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) query.roles = role;
    if (status === 'active') query.isSuspended = false;
    if (status === 'suspended') query.isSuspended = true;

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// @desc    Update user (admin)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const { roles, isSuspended, isVerified, membership } = req.body;

    const updateData = {};
    if (roles) updateData.roles = roles;
    if (isSuspended !== undefined) updateData.isSuspended = isSuspended;
    if (isVerified !== undefined) updateData.isVerified = isVerified;
    if (membership) updateData.membership = membership;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

// @desc    Delete user (admin)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Don't allow deleting other admins
    if (user.roles.includes('admin') && req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete other admin users'
      });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

// @desc    Get platform settings
// @route   GET /api/admin/settings
// @access  Private/Admin
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      // Create default settings
      settings = await Settings.create({
        general: {
          siteName: 'DealVictor',
          siteDescription: 'Multi-purpose Marketplace',
          contactEmail: 'support@dealvictor.com',
          maintenanceMode: false
        },
        memberships: [
          { name: 'Free', price: 0, bidsPerMonth: 10, platformFee: 10, features: ['10 Bids/Month', 'Basic Support', '10% Platform Fee'] },
          { name: 'Starter', price: 19, annualPrice: 149, bidsPerMonth: 50, platformFee: 7, features: ['50 Bids/Month', 'Priority Support', '7% Platform Fee'] },
          { name: 'Pro', price: 49, annualPrice: 399, bidsPerMonth: 150, platformFee: 5, isPopular: true, features: ['150 Bids/Month', '24/7 Support', '5% Platform Fee', 'Top Ranking'] },
          { name: 'Business', price: 99, annualPrice: 799, bidsPerMonth: -1, platformFee: 3, features: ['Unlimited Bids', 'Dedicated Manager', '3% Platform Fee', 'API Access'] }
        ],
        commissions: {
          defaultServiceFee: 10,
          defaultProductFee: 8,
          defaultProjectFee: 10
        },
        currencies: [
          { code: 'USD', symbol: '$', name: 'US Dollar', isDefault: true },
          { code: 'EUR', symbol: '\u20ac', name: 'Euro' },
          { code: 'GBP', symbol: '\u00a3', name: 'British Pound' },
          { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' }
        ]
      });
    }

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching settings',
      error: error.message
    });
  }
};

// @desc    Update platform settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
exports.updateSettings = async (req, res) => {
  try {
    const { general, memberships, commissions, currencies, payments, security } = req.body;

    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings();
    }

    if (general) settings.general = { ...settings.general, ...general };
    if (memberships) settings.memberships = memberships;
    if (commissions) settings.commissions = { ...settings.commissions, ...commissions };
    if (currencies) settings.currencies = currencies;
    if (payments) settings.payments = { ...settings.payments, ...payments };
    if (security) settings.security = { ...settings.security, ...security };

    await settings.save();

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating settings',
      error: error.message
    });
  }
};

// @desc    Get all projects (admin)
// @route   GET /api/admin/projects
// @access  Private/Admin
exports.getProjects = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [projects, total] = await Promise.all([
      Project.find(query)
        .populate('client', 'name email')
        .populate('freelancer', 'name email')
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit)),
      Project.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching projects',
      error: error.message
    });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (search) {
      query.orderNumber = { $regex: search, $options: 'i' };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('buyer', 'name email')
        .populate('seller', 'name email')
        .populate('service', 'title')
        .populate('product', 'name')
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// @desc    Process withdrawal request
// @route   PUT /api/admin/withdrawals/:userId/:withdrawalId
// @access  Private/Admin
exports.processWithdrawal = async (req, res) => {
  try {
    const { userId, withdrawalId } = req.params;
    const { status, transactionId, rejectionReason } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const withdrawal = user.withdrawalRequests.id(withdrawalId);
    if (!withdrawal) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal request not found'
      });
    }

    withdrawal.status = status;
    withdrawal.processedAt = new Date();

    if (status === 'completed') {
      withdrawal.transactionId = transactionId;
      user.pendingWithdrawal -= withdrawal.amount;
      user.totalWithdrawn = (user.totalWithdrawn || 0) + withdrawal.amount;
    } else if (status === 'rejected') {
      withdrawal.rejectionReason = rejectionReason;
      user.pendingWithdrawal -= withdrawal.amount;
      user.balance += withdrawal.amount; // Return funds to balance
    }

    await user.save();

    res.json({
      success: true,
      message: `Withdrawal ${status}`,
      data: withdrawal
    });
  } catch (error) {
    console.error('Process withdrawal error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing withdrawal',
      error: error.message
    });
  }
};

// @desc    Get pending withdrawals
// @route   GET /api/admin/withdrawals
// @access  Private/Admin
exports.getPendingWithdrawals = async (req, res) => {
  try {
    const users = await User.find({
      'withdrawalRequests.status': 'pending'
    }).select('name email withdrawalRequests');

    const pendingWithdrawals = [];
    users.forEach(user => {
      user.withdrawalRequests.forEach(w => {
        if (w.status === 'pending') {
          pendingWithdrawals.push({
            userId: user._id,
            userName: user.name,
            userEmail: user.email,
            ...w.toObject()
          });
        }
      });
    });

    res.json({
      success: true,
      data: pendingWithdrawals.sort((a, b) => b.requestedAt - a.requestedAt)
    });
  } catch (error) {
    console.error('Get pending withdrawals error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching withdrawals',
      error: error.message
    });
  }
};

// @desc    Get revenue report
// @route   GET /api/admin/reports/revenue
// @access  Private/Admin
exports.getRevenueReport = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;

    const matchStage = { status: 'completed' };
    if (startDate) matchStage.completedAt = { $gte: new Date(startDate) };
    if (endDate) matchStage.completedAt = { ...matchStage.completedAt, $lte: new Date(endDate) };

    let groupId;
    if (groupBy === 'day') {
      groupId = { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } };
    } else if (groupBy === 'month') {
      groupId = { $dateToString: { format: '%Y-%m', date: '$completedAt' } };
    } else {
      groupId = { $dateToString: { format: '%Y', date: '$completedAt' } };
    }

    const revenue = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: groupId,
          totalRevenue: { $sum: '$price' },
          platformFees: { $sum: '$platformFee' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: revenue
    });
  } catch (error) {
    console.error('Get revenue report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching revenue report',
      error: error.message
    });
  }
};
