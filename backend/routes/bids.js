const express = require('express');
const router = express.Router();
const Bid = require('../models/Bid');
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');

// @route   GET /api/bids/project/:projectId
// @desc    Get all bids for a project
router.get('/project/:projectId', async (req, res) => {
  try {
    const bids = await Bid.find({ project: req.params.projectId })
      .populate('freelancer', 'firstName lastName avatar freelancerProfile stats')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: bids });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/bids
// @desc    Create a bid
router.post('/', protect, async (req, res) => {
  try {
    req.body.freelancer = req.user.id;
    const bid = await Bid.create(req.body);

    // Increment bid count on project
    await Project.findByIdAndUpdate(req.body.project, { $inc: { totalBids: 1 } });

    res.status(201).json({ success: true, data: bid });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'You already bid on this project' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/bids/:id
// @desc    Update bid
router.put('/:id', protect, async (req, res) => {
  try {
    let bid = await Bid.findById(req.params.id);
    if (!bid) return res.status(404).json({ success: false, message: 'Bid not found' });
    if (bid.freelancer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    bid = await Bid.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: bid });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/bids/:id
// @desc    Withdraw bid
router.delete('/:id', protect, async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id);
    if (!bid) return res.status(404).json({ success: false, message: 'Bid not found' });
    if (bid.freelancer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    bid.status = 'withdrawn';
    bid.withdrawnAt = new Date();
    await bid.save();
    res.json({ success: true, message: 'Bid withdrawn' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
