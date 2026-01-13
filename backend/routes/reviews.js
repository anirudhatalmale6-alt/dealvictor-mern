const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   GET /api/reviews
router.get('/', async (req, res) => {
  try {
    const { userId, productId, serviceId, page = 1, limit = 10 } = req.query;
    let query = { status: 'approved' };

    if (userId) query.reviewee = userId;
    if (productId) query.product = productId;
    if (serviceId) query.service = serviceId;

    const reviews = await Review.find(query)
      .populate('reviewer', 'firstName lastName avatar')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments(query);
    res.json({ success: true, data: reviews, pagination: { page: parseInt(page), total } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/reviews
router.post('/', protect, async (req, res) => {
  try {
    req.body.reviewer = req.user.id;
    const review = await Review.create(req.body);

    // Update user/product/service stats
    const reviews = await Review.find({ reviewee: req.body.reviewee, status: 'approved' });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    await User.findByIdAndUpdate(req.body.reviewee, {
      'stats.avgRating': avgRating.toFixed(1),
      'stats.totalReviews': reviews.length
    });

    res.status(201).json({ success: true, data: review });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'You already reviewed this' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/reviews/:id/response
router.put('/:id/response', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    if (review.reviewee.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    review.response = {
      content: req.body.response,
      createdAt: new Date()
    };
    await review.save();

    res.json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
