const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');
const Product = require('../models/Product');
const Service = require('../models/Service');
const Order = require('../models/Order');
const { protect, authorize } = require('../middleware/auth');

// All routes require admin
router.use(protect, authorize('admin'));

// @route   GET /api/admin/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const stats = {
      users: {
        total: await User.countDocuments(),
        buyers: await User.countDocuments({ role: 'buyer' }),
        freelancers: await User.countDocuments({ role: 'freelancer' }),
        sellers: await User.countDocuments({ role: 'seller' }),
        newThisMonth: await User.countDocuments({
          createdAt: { $gte: new Date(new Date().setDate(1)) }
        })
      },
      projects: {
        total: await Project.countDocuments(),
        open: await Project.countDocuments({ status: 'open' }),
        inProgress: await Project.countDocuments({ status: 'in_progress' }),
        completed: await Project.countDocuments({ status: 'completed' })
      },
      products: {
        total: await Product.countDocuments(),
        active: await Product.countDocuments({ status: 'active' })
      },
      orders: {
        total: await Order.countDocuments(),
        pending: await Order.countDocuments({ status: 'pending' }),
        completed: await Order.countDocuments({ status: 'delivered' })
      }
    };

    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const { role, status, search, page = 1, limit = 20 } = req.query;
    let query = {};

    if (role) query.role = role;
    if (status === 'active') query.isActive = true;
    if (status === 'inactive') query.isActive = false;
    if (search) {
      query.$or = [
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);
    res.json({ success: true, data: users, pagination: { page: parseInt(page), total } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/admin/users/:id
router.put('/users/:id', async (req, res) => {
  try {
    const { isActive, isVerified, role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive, isVerified, role },
      { new: true }
    ).select('-password');
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/admin/settings
router.get('/settings', async (req, res) => {
  // Return settings from database or env
  res.json({
    success: true,
    data: {
      siteName: 'DealVictor',
      siteEmail: process.env.FROM_EMAIL,
      stripeEnabled: !!process.env.STRIPE_SECRET_KEY,
      twilioEnabled: !!process.env.TWILIO_ACCOUNT_SID,
      smtpEnabled: !!process.env.SMTP_HOST
    }
  });
});

// @route   PUT /api/admin/settings
router.put('/settings', async (req, res) => {
  // In production, save to database
  res.json({ success: true, message: 'Settings updated' });
});

// === SERVICE APPROVAL ROUTES ===

// @route   GET /api/admin/services
// @desc    Get all services with filters
router.get('/services', async (req, res) => {
  try {
    const { status, approvalStatus, search, page = 1, limit = 20 } = req.query;
    let query = {};

    if (status) query.status = status;
    if (approvalStatus) query.approvalStatus = approvalStatus;
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    const services = await Service.find(query)
      .populate('freelancer', 'firstName lastName email avatar')
      .populate('category', 'name')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Service.countDocuments(query);

    res.json({
      success: true,
      data: services,
      pagination: { page: parseInt(page), total, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    console.error('Admin get services error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/admin/services/pending
// @desc    Get pending services awaiting approval
router.get('/services/pending', async (req, res) => {
  try {
    const services = await Service.find({ approvalStatus: 'pending' })
      .populate('freelancer', 'firstName lastName email avatar')
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (err) {
    console.error('Get pending services error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/admin/services/:id/approve
// @desc    Approve a service
router.put('/services/:id/approve', async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      {
        approvalStatus: 'approved',
        status: 'active',
        approvedBy: req.user.id,
        approvedAt: new Date()
      },
      { new: true }
    ).populate('freelancer', 'firstName lastName email');

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    // TODO: Send notification to freelancer about approval

    res.json({
      success: true,
      message: 'Service approved successfully',
      data: service
    });
  } catch (err) {
    console.error('Approve service error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/admin/services/:id/reject
// @desc    Reject a service
router.put('/services/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      {
        approvalStatus: 'rejected',
        status: 'rejected',
        rejectionReason: reason,
        approvedBy: req.user.id,
        approvedAt: new Date()
      },
      { new: true }
    ).populate('freelancer', 'firstName lastName email');

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    // TODO: Send notification to freelancer about rejection

    res.json({
      success: true,
      message: 'Service rejected',
      data: service
    });
  } catch (err) {
    console.error('Reject service error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// === PROJECT APPROVAL ROUTES ===

// @route   GET /api/admin/projects
// @desc    Get all projects with filters
router.get('/projects', async (req, res) => {
  try {
    const { status, approvalStatus, search, page = 1, limit = 20 } = req.query;
    let query = {};

    if (status) query.status = status;
    if (approvalStatus) query.approvalStatus = approvalStatus;
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    const projects = await Project.find(query)
      .populate('buyer', 'firstName lastName email avatar')
      .populate('category', 'name')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Project.countDocuments(query);

    res.json({
      success: true,
      data: projects,
      pagination: { page: parseInt(page), total, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    console.error('Admin get projects error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/admin/projects/pending
// @desc    Get pending projects awaiting approval
router.get('/projects/pending', async (req, res) => {
  try {
    const projects = await Project.find({ approvalStatus: 'pending' })
      .populate('buyer', 'firstName lastName email avatar')
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (err) {
    console.error('Get pending projects error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/admin/projects/:id/approve
// @desc    Approve a project
router.put('/projects/:id/approve', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        approvalStatus: 'approved',
        status: 'open',
        approvedBy: req.user.id,
        approvedAt: new Date()
      },
      { new: true }
    ).populate('buyer', 'firstName lastName email');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // TODO: Send notification to client about approval

    res.json({
      success: true,
      message: 'Project approved successfully',
      data: project
    });
  } catch (err) {
    console.error('Approve project error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/admin/projects/:id/reject
// @desc    Reject a project
router.put('/projects/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        approvalStatus: 'rejected',
        status: 'rejected',
        rejectionReason: reason,
        approvedBy: req.user.id,
        approvedAt: new Date()
      },
      { new: true }
    ).populate('buyer', 'firstName lastName email');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // TODO: Send notification to client about rejection

    res.json({
      success: true,
      message: 'Project rejected',
      data: project
    });
  } catch (err) {
    console.error('Reject project error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// === USER WALLET/BALANCE ROUTES ===

// @route   GET /api/admin/users/:id/wallet
// @desc    Get user wallet details
router.get('/users/:id/wallet', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('firstName lastName email balance pendingWithdrawal totalWithdrawn totalEarned withdrawalRequests');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email
        },
        wallet: {
          balance: user.balance || 0,
          pendingWithdrawal: user.pendingWithdrawal || 0,
          totalWithdrawn: user.totalWithdrawn || 0,
          totalEarned: user.totalEarned || 0
        },
        withdrawalRequests: user.withdrawalRequests || []
      }
    });
  } catch (err) {
    console.error('Get user wallet error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/admin/users/:id/wallet
// @desc    Update user wallet (add/deduct funds)
router.put('/users/:id/wallet', async (req, res) => {
  try {
    const { amount, type, reason } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (type === 'add') {
      user.balance = (user.balance || 0) + amount;
    } else if (type === 'deduct') {
      if ((user.balance || 0) < amount) {
        return res.status(400).json({ success: false, message: 'Insufficient balance' });
      }
      user.balance = (user.balance || 0) - amount;
    }

    // Log the transaction
    if (!user.transactions) user.transactions = [];
    user.transactions.push({
      type,
      amount,
      reason,
      performedBy: req.user.id,
      createdAt: new Date()
    });

    await user.save();

    res.json({
      success: true,
      message: `Successfully ${type === 'add' ? 'added' : 'deducted'} $${amount}`,
      data: {
        newBalance: user.balance
      }
    });
  } catch (err) {
    console.error('Update user wallet error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Don't allow deleting other admins
    if (user.role === 'admin' || user.roles?.includes('admin')) {
      return res.status(403).json({ success: false, message: 'Cannot delete admin users' });
    }

    await user.deleteOne();

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/admin/users/:id/suspend
// @desc    Suspend/unsuspend user
router.put('/users/:id/suspend', async (req, res) => {
  try {
    const { suspend, reason } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        status: suspend ? 'suspended' : 'active',
        suspendedAt: suspend ? new Date() : null,
        suspensionReason: suspend ? reason : null
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: suspend ? 'User suspended' : 'User unsuspended',
      data: user
    });
  } catch (err) {
    console.error('Suspend user error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
