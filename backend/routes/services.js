const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { protect, optionalAuth } = require('../middleware/auth');

// @route   GET /api/services
router.get('/', async (req, res) => {
  try {
    const { category, freelancer, search, min_price, max_price, page = 1, limit = 12 } = req.query;
    let query = { status: 'active' };

    if (category) query.category = category;
    if (freelancer) query.freelancer = freelancer;
    if (min_price) query.startingPrice = { $gte: parseFloat(min_price) };
    if (max_price) query.startingPrice = { ...query.startingPrice, $lte: parseFloat(max_price) };
    if (search) query.$text = { $search: search };

    const services = await Service.find(query)
      .populate('freelancer', 'firstName lastName avatar freelancerProfile stats')
      .populate('category', 'name slug')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ 'stats.avgRating': -1 });

    const total = await Service.countDocuments(query);

    res.json({
      success: true,
      data: services,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/services/:id
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('freelancer', 'firstName lastName avatar freelancerProfile stats createdAt')
      .populate('category', 'name slug');
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    service.stats.views += 1;
    await service.save();
    res.json({ success: true, data: service });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/services
router.post('/', protect, async (req, res) => {
  try {
    req.body.freelancer = req.user.id;
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, data: service });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/services/:id
router.put('/:id', protect, async (req, res) => {
  try {
    let service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    if (service.freelancer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: service });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/services/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    if (service.freelancer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    service.status = 'deleted';
    await service.save();
    res.json({ success: true, message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
