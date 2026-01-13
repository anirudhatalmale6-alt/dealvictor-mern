const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');
const Product = require('../models/Product');
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

module.exports = router;
