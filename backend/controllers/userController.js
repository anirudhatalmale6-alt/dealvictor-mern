const User = require('../models/User');
const Order = require('../models/Order');
const Project = require('../models/Project');

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -resetPasswordToken -resetPasswordExpire -emailVerificationToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      bio,
      skills,
      hourlyRate,
      avatar,
      location,
      languages,
      phone,
      socialLinks,
      companyName,
      companyDescription
    } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (skills) updateData.skills = skills;
    if (hourlyRate !== undefined) updateData.hourlyRate = hourlyRate;
    if (avatar) updateData.avatar = avatar;
    if (location) updateData.location = location;
    if (languages) updateData.languages = languages;
    if (phone) updateData.phone = phone;
    if (socialLinks) updateData.socialLinks = socialLinks;
    if (companyName !== undefined) updateData.companyName = companyName;
    if (companyDescription !== undefined) updateData.companyDescription = companyDescription;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// @desc    Get user earnings summary
// @route   GET /api/users/earnings
// @access  Private
exports.getEarnings = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get completed orders where user is seller
    const completedOrders = await Order.find({
      seller: userId,
      status: 'completed'
    });

    // Get completed projects where user is freelancer
    const completedProjects = await Project.find({
      freelancer: userId,
      status: 'completed'
    });

    // Calculate earnings
    const serviceEarnings = completedOrders.reduce((sum, order) => sum + (order.sellerEarnings || 0), 0);
    const projectEarnings = completedProjects.reduce((sum, project) => sum + (project.freelancerEarnings || 0), 0);

    // Get pending earnings (in progress)
    const pendingOrders = await Order.find({
      seller: userId,
      status: { $in: ['in_progress', 'delivered'] }
    });
    const pendingProjects = await Project.find({
      freelancer: userId,
      status: 'in_progress'
    });

    const pendingEarnings =
      pendingOrders.reduce((sum, order) => sum + order.price, 0) +
      pendingProjects.reduce((sum, project) => sum + (project.budget || 0), 0);

    // Get user for withdrawal info
    const user = await User.findById(userId);

    res.json({
      success: true,
      data: {
        totalEarnings: serviceEarnings + projectEarnings,
        serviceEarnings,
        projectEarnings,
        pendingEarnings,
        availableBalance: user.balance || 0,
        totalWithdrawn: user.totalWithdrawn || 0,
        completedOrders: completedOrders.length,
        completedProjects: completedProjects.length
      }
    });
  } catch (error) {
    console.error('Get earnings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching earnings',
      error: error.message
    });
  }
};

// @desc    Request withdrawal
// @route   POST /api/users/withdraw
// @access  Private
exports.requestWithdrawal = async (req, res) => {
  try {
    const { amount, paymentMethod, paymentDetails } = req.body;
    const user = await User.findById(req.user.id);

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid withdrawal amount'
      });
    }

    if (amount > user.balance) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    const minWithdrawal = 50; // Minimum withdrawal amount
    if (amount < minWithdrawal) {
      return res.status(400).json({
        success: false,
        message: `Minimum withdrawal amount is $${minWithdrawal}`
      });
    }

    // Create withdrawal request
    const withdrawal = {
      amount,
      paymentMethod,
      paymentDetails,
      status: 'pending',
      requestedAt: new Date()
    };

    // Deduct from balance
    user.balance -= amount;
    user.pendingWithdrawal = (user.pendingWithdrawal || 0) + amount;
    user.withdrawalRequests = user.withdrawalRequests || [];
    user.withdrawalRequests.push(withdrawal);
    await user.save();

    res.json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      data: {
        withdrawal,
        newBalance: user.balance
      }
    });
  } catch (error) {
    console.error('Withdrawal request error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing withdrawal request',
      error: error.message
    });
  }
};

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [
      totalProjects,
      completedProjects,
      activeProjects,
      totalOrders,
      completedOrders
    ] = await Promise.all([
      Project.countDocuments({ $or: [{ client: userId }, { freelancer: userId }] }),
      Project.countDocuments({ freelancer: userId, status: 'completed' }),
      Project.countDocuments({ freelancer: userId, status: 'in_progress' }),
      Order.countDocuments({ $or: [{ buyer: userId }, { seller: userId }] }),
      Order.countDocuments({ seller: userId, status: 'completed' })
    ]);

    const user = await User.findById(userId);

    res.json({
      success: true,
      data: {
        totalProjects,
        completedProjects,
        activeProjects,
        totalOrders,
        completedOrders,
        rating: user.rating || 0,
        reviewCount: user.reviewCount || 0,
        memberSince: user.createdAt,
        membership: user.membership
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics',
      error: error.message
    });
  }
};

// @desc    Update user settings
// @route   PUT /api/users/settings
// @access  Private
exports.updateSettings = async (req, res) => {
  try {
    const {
      emailNotifications,
      smsNotifications,
      currency,
      language,
      timezone,
      profileVisibility
    } = req.body;

    const settings = {};
    if (emailNotifications !== undefined) settings['settings.emailNotifications'] = emailNotifications;
    if (smsNotifications !== undefined) settings['settings.smsNotifications'] = smsNotifications;
    if (currency) settings['settings.currency'] = currency;
    if (language) settings['settings.language'] = language;
    if (timezone) settings['settings.timezone'] = timezone;
    if (profileVisibility) settings['settings.profileVisibility'] = profileVisibility;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      settings,
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: user.settings
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

// @desc    Become a seller
// @route   POST /api/users/become-seller
// @access  Private
exports.becomeSeller = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.roles.includes('seller')) {
      return res.status(400).json({
        success: false,
        message: 'You are already a seller'
      });
    }

    user.roles.push('seller');
    await user.save();

    res.json({
      success: true,
      message: 'You are now a seller! You can start listing services and products.',
      data: user
    });
  } catch (error) {
    console.error('Become seller error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing request',
      error: error.message
    });
  }
};

// @desc    Get user's bid balance and membership info
// @route   GET /api/users/membership
// @access  Private
exports.getMembershipInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      data: {
        membership: user.membership,
        bidsRemaining: user.membership.bidsRemaining,
        totalBidsThisMonth: user.membership.bidsPerMonth,
        platformFee: user.membership.platformFee,
        membershipExpiry: user.membership.expiresAt,
        nextBidRecharge: user.membership.nextBidRecharge
      }
    });
  } catch (error) {
    console.error('Get membership info error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching membership info',
      error: error.message
    });
  }
};
