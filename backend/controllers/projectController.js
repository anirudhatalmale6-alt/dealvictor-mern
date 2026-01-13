const Project = require('../models/Project');
const Bid = require('../models/Bid');
const User = require('../models/User');

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      skills,
      budget,
      deadline,
      attachments
    } = req.body;

    const project = await Project.create({
      title,
      description,
      category,
      skills,
      budget,
      deadline,
      attachments,
      client: req.user.id
    });

    await project.populate('client', 'name email avatar rating');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating project',
      error: error.message
    });
  }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      skills,
      minBudget,
      maxBudget,
      status,
      search,
      sort = '-createdAt'
    } = req.query;

    // Build query
    const query = {};

    if (category) query.category = category;
    if (status) query.status = status;
    else query.status = 'open'; // Default to open projects

    if (skills) {
      const skillsArray = skills.split(',');
      query.skills = { $in: skillsArray };
    }

    if (minBudget || maxBudget) {
      query['budget.min'] = {};
      if (minBudget) query['budget.min'].$gte = Number(minBudget);
      if (maxBudget) query['budget.max'] = { $lte: Number(maxBudget) };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [projects, total] = await Promise.all([
      Project.find(query)
        .populate('client', 'name email avatar rating reviewCount country isVerified')
        .populate('category', 'name')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      Project.countDocuments(query)
    ]);

    res.json({
      success: true,
      projects,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
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

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('client', 'name email avatar rating reviewCount country isVerified createdAt projectsPosted')
      .populate('category', 'name')
      .populate({
        path: 'bids',
        populate: {
          path: 'freelancer',
          select: 'name avatar rating reviewCount skills'
        }
      });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Increment view count
    project.viewCount = (project.viewCount || 0) + 1;
    await project.save();

    res.json({
      success: true,
      project
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching project',
      error: error.message
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Project owner only)
exports.updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check ownership
    if (project.client.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project'
      });
    }

    const allowedUpdates = ['title', 'description', 'skills', 'budget', 'deadline', 'attachments'];
    const updates = {};

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    project = await Project.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('client', 'name email avatar');

    res.json({
      success: true,
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating project',
      error: error.message
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Project owner only)
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check ownership
    if (project.client.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this project'
      });
    }

    // Only allow deletion if no bids or project is draft
    if (project.bidsCount > 0 && project.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete project with existing bids'
      });
    }

    await project.deleteOne();

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting project',
      error: error.message
    });
  }
};

// @desc    Get my projects (as client)
// @route   GET /api/projects/my/client
// @access  Private
exports.getMyClientProjects = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { client: req.user.id };
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [projects, total] = await Promise.all([
      Project.find(query)
        .populate('assignedFreelancer', 'name avatar rating')
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit)),
      Project.countDocuments(query)
    ]);

    res.json({
      success: true,
      projects,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get my client projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching projects',
      error: error.message
    });
  }
};

// @desc    Get my projects (as freelancer)
// @route   GET /api/projects/my/freelancer
// @access  Private
exports.getMyFreelancerProjects = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { assignedFreelancer: req.user.id };
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [projects, total] = await Promise.all([
      Project.find(query)
        .populate('client', 'name avatar rating')
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit)),
      Project.countDocuments(query)
    ]);

    res.json({
      success: true,
      projects,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get my freelancer projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching projects',
      error: error.message
    });
  }
};

// @desc    Award project to freelancer
// @route   PUT /api/projects/:id/award
// @access  Private (Project owner only)
exports.awardProject = async (req, res) => {
  try {
    const { bidId } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check ownership
    if (project.client.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to award this project'
      });
    }

    const bid = await Bid.findById(bidId).populate('freelancer', 'name email');
    if (!bid) {
      return res.status(404).json({
        success: false,
        message: 'Bid not found'
      });
    }

    // Update bid status
    bid.status = 'accepted';
    await bid.save();

    // Update other bids to rejected
    await Bid.updateMany(
      { project: project._id, _id: { $ne: bidId } },
      { status: 'rejected' }
    );

    // Update project
    project.status = 'in_progress';
    project.assignedFreelancer = bid.freelancer._id;
    project.awardedBid = bidId;
    project.agreedAmount = bid.amount;
    project.agreedDeliveryDays = bid.deliveryDays;
    await project.save();

    // TODO: Send notification to freelancer

    res.json({
      success: true,
      message: 'Project awarded successfully',
      project
    });
  } catch (error) {
    console.error('Award project error:', error);
    res.status(500).json({
      success: false,
      message: 'Error awarding project',
      error: error.message
    });
  }
};

// @desc    Complete project
// @route   PUT /api/projects/:id/complete
// @access  Private
exports.completeProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Only client can mark as complete
    if (project.client.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to complete this project'
      });
    }

    project.status = 'completed';
    project.completedAt = new Date();
    await project.save();

    // TODO: Release payment from escrow to freelancer

    res.json({
      success: true,
      message: 'Project marked as completed',
      project
    });
  } catch (error) {
    console.error('Complete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Error completing project',
      error: error.message
    });
  }
};
