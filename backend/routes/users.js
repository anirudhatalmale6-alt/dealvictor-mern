const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/users
// @desc    Get all users (with filters)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { role, skills, location, search, page = 1, limit = 10 } = req.query;

    let query = { isActive: true };

    if (role) query.role = role;
    if (location) query['location.country'] = new RegExp(location, 'i');
    if (skills) {
      query['freelancerProfile.skills'] = { $in: skills.split(',').map(s => new RegExp(s.trim(), 'i')) };
    }
    if (search) {
      query.$or = [
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') },
        { 'freelancerProfile.title': new RegExp(search, 'i') }
      ];
    }

    const users = await User.find(query)
      .select('-password -resetPasswordToken -verificationToken')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ 'stats.avgRating': -1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/users/freelancers
// @desc    Get all freelancers with filters
// @access  Public
router.get('/freelancers', async (req, res) => {
  try {
    const {
      skills,
      minRate,
      maxRate,
      experienceLevel,
      country,
      availability,
      search,
      sort = '-stats.avgRating',
      isOnline,
      page = 1,
      limit = 12
    } = req.query;

    let query = {
      isActive: true,
      $or: [
        { role: 'freelancer' },
        { roles: 'freelancer' }
      ]
    };

    if (skills) {
      const skillsArray = skills.split(',').map(s => new RegExp(s.trim(), 'i'));
      query['freelancerProfile.skills'] = { $in: skillsArray };
    }

    if (minRate || maxRate) {
      query['freelancerProfile.hourlyRate'] = {};
      if (minRate) query['freelancerProfile.hourlyRate'].$gte = Number(minRate);
      if (maxRate) query['freelancerProfile.hourlyRate'].$lte = Number(maxRate);
    }

    if (experienceLevel) {
      query['freelancerProfile.experience'] = experienceLevel;
    }

    if (country) {
      query['location.country'] = new RegExp(country, 'i');
    }

    if (availability) {
      query['freelancerProfile.availability'] = availability;
    }

    if (isOnline === 'true') {
      query.isOnline = true;
    }

    if (search) {
      query.$and = [
        query.$or ? { $or: query.$or } : {},
        {
          $or: [
            { firstName: new RegExp(search, 'i') },
            { lastName: new RegExp(search, 'i') },
            { 'freelancerProfile.title': new RegExp(search, 'i') },
            { 'freelancerProfile.skills': { $in: [new RegExp(search, 'i')] } }
          ]
        }
      ];
      delete query.$or;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password -resetPasswordToken -verificationToken -notifications -withdrawalRequests')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(query)
    ]);

    res.json({
      success: true,
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    console.error('Get freelancers error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -resetPasswordToken -verificationToken');

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
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const allowedUpdates = [
      'firstName', 'lastName', 'phone', 'avatar', 'location',
      'freelancerProfile', 'sellerProfile', 'notifications'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/users/:id/reviews
// @desc    Get user reviews
// @access  Public
router.get('/:id/reviews', async (req, res) => {
  try {
    const Review = require('../models/Review');
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ reviewee: req.params.id, status: 'approved' })
      .populate('reviewer', 'firstName lastName avatar')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments({ reviewee: req.params.id, status: 'approved' });

    res.json({
      success: true,
      data: reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
