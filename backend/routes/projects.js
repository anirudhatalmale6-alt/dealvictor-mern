const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

// @route   GET /api/projects
// @desc    Get all projects
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      category, skills, budget_min, budget_max, duration,
      experience, search, status = 'open', page = 1, limit = 10
    } = req.query;

    let query = { status };

    if (category) query.category = category;
    if (skills) {
      query.skills = { $in: skills.split(',').map(s => s.trim()) };
    }
    if (budget_min || budget_max) {
      query['budget.min'] = {};
      if (budget_min) query['budget.min'].$gte = parseInt(budget_min);
      if (budget_max) query['budget.max'] = { $lte: parseInt(budget_max) };
    }
    if (duration) query.duration = duration;
    if (experience) query.experienceLevel = experience;
    if (search) {
      query.$text = { $search: search };
    }

    const projects = await Project.find(query)
      .populate('buyer', 'firstName lastName avatar location stats')
      .populate('category', 'name slug')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Project.countDocuments(query);

    res.json({
      success: true,
      data: projects,
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

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('buyer', 'firstName lastName avatar location stats createdAt')
      .populate('category', 'name slug')
      .populate('freelancer', 'firstName lastName avatar');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Increment views
    project.views += 1;
    await project.save();

    res.json({
      success: true,
      data: project
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/projects
// @desc    Create new project
// @access  Private (Buyer)
router.post('/', protect, async (req, res) => {
  try {
    req.body.buyer = req.user.id;

    const project = await Project.create(req.body);

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private (Project Owner)
router.put('/:id', protect, async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check ownership
    if (project.buyer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project'
      });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: project
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private (Project Owner)
router.delete('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check ownership
    if (project.buyer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this project'
      });
    }

    // Soft delete - change status
    project.status = 'cancelled';
    await project.save();

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/projects/:id/award/:bidId
// @desc    Award project to freelancer
// @access  Private (Project Owner)
router.post('/:id/award/:bidId', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    const Bid = require('../models/Bid');
    const bid = await Bid.findById(req.params.bidId);

    if (!project || !bid) {
      return res.status(404).json({
        success: false,
        message: 'Project or bid not found'
      });
    }

    // Check ownership
    if (project.buyer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to award this project'
      });
    }

    // Update project
    project.freelancer = bid.freelancer;
    project.awardedBid = bid._id;
    project.status = 'in_progress';
    project.startedAt = new Date();
    await project.save();

    // Update bid
    bid.status = 'accepted';
    bid.awardedAt = new Date();
    await bid.save();

    // Reject other bids
    await Bid.updateMany(
      { project: project._id, _id: { $ne: bid._id } },
      { status: 'rejected', rejectedAt: new Date() }
    );

    res.json({
      success: true,
      message: 'Project awarded successfully',
      data: project
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
