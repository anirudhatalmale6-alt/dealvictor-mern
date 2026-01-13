const Bid = require('../models/Bid');
const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Create new bid
// @route   POST /api/bids
// @access  Private (Freelancers only)
exports.createBid = async (req, res) => {
  try {
    const { projectId, amount, deliveryDays, proposal } = req.body;

    // Check if project exists and is open
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (project.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'This project is no longer accepting bids'
      });
    }

    // Check if user is the project owner
    if (project.client.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot bid on your own project'
      });
    }

    // Check if user already bid on this project
    const existingBid = await Bid.findOne({
      project: projectId,
      freelancer: req.user.id
    });

    if (existingBid) {
      return res.status(400).json({
        success: false,
        message: 'You have already placed a bid on this project'
      });
    }

    // Check user's bid balance
    const user = await User.findById(req.user.id);
    if (user.membership.bidsRemaining <= 0) {
      return res.status(400).json({
        success: false,
        message: 'You have no bids remaining. Please upgrade your membership or purchase more bids.'
      });
    }

    // Create bid
    const bid = await Bid.create({
      project: projectId,
      freelancer: req.user.id,
      amount,
      deliveryDays,
      proposal
    });

    // Deduct bid from user's balance
    user.membership.bidsRemaining -= 1;
    await user.save();

    // Update project bid count
    project.bidsCount = (project.bidsCount || 0) + 1;
    await project.save();

    await bid.populate('freelancer', 'name avatar rating reviewCount skills');

    res.status(201).json({
      success: true,
      message: 'Bid placed successfully',
      bid,
      bidsRemaining: user.membership.bidsRemaining
    });
  } catch (error) {
    console.error('Create bid error:', error);
    res.status(500).json({
      success: false,
      message: 'Error placing bid',
      error: error.message
    });
  }
};

// @desc    Get bids for a project
// @route   GET /api/bids/project/:projectId
// @access  Public
exports.getProjectBids = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { page = 1, limit = 20, sort = '-createdAt' } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const [bids, total] = await Promise.all([
      Bid.find({ project: projectId })
        .populate('freelancer', 'name avatar rating reviewCount skills country createdAt')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      Bid.countDocuments({ project: projectId })
    ]);

    res.json({
      success: true,
      bids,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get project bids error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bids',
      error: error.message
    });
  }
};

// @desc    Get my bids (as freelancer)
// @route   GET /api/bids/my
// @access  Private
exports.getMyBids = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { freelancer: req.user.id };
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [bids, total] = await Promise.all([
      Bid.find(query)
        .populate({
          path: 'project',
          select: 'title budget status client',
          populate: {
            path: 'client',
            select: 'name avatar'
          }
        })
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit)),
      Bid.countDocuments(query)
    ]);

    res.json({
      success: true,
      bids,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get my bids error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bids',
      error: error.message
    });
  }
};

// @desc    Get single bid
// @route   GET /api/bids/:id
// @access  Private
exports.getBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id)
      .populate('freelancer', 'name avatar rating reviewCount skills country')
      .populate({
        path: 'project',
        select: 'title budget status client',
        populate: {
          path: 'client',
          select: 'name avatar'
        }
      });

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: 'Bid not found'
      });
    }

    res.json({
      success: true,
      bid
    });
  } catch (error) {
    console.error('Get bid error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bid',
      error: error.message
    });
  }
};

// @desc    Update bid
// @route   PUT /api/bids/:id
// @access  Private (Bid owner only)
exports.updateBid = async (req, res) => {
  try {
    let bid = await Bid.findById(req.params.id);

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: 'Bid not found'
      });
    }

    // Check ownership
    if (bid.freelancer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this bid'
      });
    }

    // Only allow update if bid is pending
    if (bid.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update bid that is no longer pending'
      });
    }

    const allowedUpdates = ['amount', 'deliveryDays', 'proposal'];
    const updates = {};

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    bid = await Bid.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('freelancer', 'name avatar rating');

    res.json({
      success: true,
      message: 'Bid updated successfully',
      bid
    });
  } catch (error) {
    console.error('Update bid error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating bid',
      error: error.message
    });
  }
};

// @desc    Withdraw/Delete bid
// @route   DELETE /api/bids/:id
// @access  Private (Bid owner only)
exports.withdrawBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id);

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: 'Bid not found'
      });
    }

    // Check ownership
    if (bid.freelancer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to withdraw this bid'
      });
    }

    // Only allow withdrawal if bid is pending
    if (bid.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot withdraw bid that is no longer pending'
      });
    }

    // Update project bid count
    await Project.findByIdAndUpdate(bid.project, {
      $inc: { bidsCount: -1 }
    });

    // Optionally refund the bid (based on settings)
    // const user = await User.findById(req.user.id);
    // user.membership.bidsRemaining += 1;
    // await user.save();

    await bid.deleteOne();

    res.json({
      success: true,
      message: 'Bid withdrawn successfully'
    });
  } catch (error) {
    console.error('Withdraw bid error:', error);
    res.status(500).json({
      success: false,
      message: 'Error withdrawing bid',
      error: error.message
    });
  }
};
