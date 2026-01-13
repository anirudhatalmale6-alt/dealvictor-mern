const Review = require('../models/Review');
const User = require('../models/User');
const Order = require('../models/Order');
const Project = require('../models/Project');
const Service = require('../models/Service');
const Product = require('../models/Product');

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res) => {
  try {
    const {
      reviewedUser,
      orderId,
      projectId,
      serviceId,
      productId,
      rating,
      title,
      comment,
      communication,
      quality,
      expertise,
      professionalism,
      wouldRecommend
    } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check if user can review (must have completed transaction)
    let canReview = false;
    let reviewType = null;

    if (orderId) {
      const order = await Order.findById(orderId);
      if (order && order.status === 'completed' &&
          (order.buyer.toString() === req.user.id || order.seller.toString() === req.user.id)) {
        canReview = true;
        reviewType = 'order';
      }
    } else if (projectId) {
      const project = await Project.findById(projectId);
      if (project && project.status === 'completed' &&
          (project.client.toString() === req.user.id || project.freelancer.toString() === req.user.id)) {
        canReview = true;
        reviewType = 'project';
      }
    }

    if (!canReview) {
      return res.status(403).json({
        success: false,
        message: 'You can only review after completing a transaction'
      });
    }

    // Check for duplicate review
    const existingReview = await Review.findOne({
      reviewer: req.user.id,
      reviewedUser,
      $or: [{ order: orderId }, { project: projectId }]
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this transaction'
      });
    }

    // Calculate overall rating from sub-ratings if provided
    let overallRating = rating;
    if (communication && quality && expertise && professionalism) {
      overallRating = (communication + quality + expertise + professionalism) / 4;
    }

    const review = await Review.create({
      reviewer: req.user.id,
      reviewedUser,
      order: orderId,
      project: projectId,
      service: serviceId,
      product: productId,
      rating: overallRating,
      title,
      comment,
      subRatings: {
        communication,
        quality,
        expertise,
        professionalism
      },
      wouldRecommend,
      reviewType
    });

    // Update reviewed user's rating
    await updateUserRating(reviewedUser);

    // Update service/product rating if applicable
    if (serviceId) await updateServiceRating(serviceId);
    if (productId) await updateProductRating(productId);

    await review.populate([
      { path: 'reviewer', select: 'name avatar' },
      { path: 'reviewedUser', select: 'name avatar' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating review',
      error: error.message
    });
  }
};

// @desc    Get reviews for a user
// @route   GET /api/reviews/user/:userId
// @access  Public
exports.getUserReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [reviews, total] = await Promise.all([
      Review.find({ reviewedUser: req.params.userId })
        .populate('reviewer', 'name avatar')
        .populate('service', 'title')
        .populate('product', 'name')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      Review.countDocuments({ reviewedUser: req.params.userId })
    ]);

    // Calculate rating breakdown
    const ratingBreakdown = await Review.aggregate([
      { $match: { reviewedUser: req.params.userId } },
      { $group: { _id: '$rating', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        reviews,
        ratingBreakdown,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};

// @desc    Get reviews for a service
// @route   GET /api/reviews/service/:serviceId
// @access  Public
exports.getServiceReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [reviews, total] = await Promise.all([
      Review.find({ service: req.params.serviceId })
        .populate('reviewer', 'name avatar')
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit)),
      Review.countDocuments({ service: req.params.serviceId })
    ]);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get service reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
exports.getProductReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [reviews, total] = await Promise.all([
      Review.find({ product: req.params.productId })
        .populate('reviewer', 'name avatar')
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit)),
      Review.countDocuments({ product: req.params.productId })
    ]);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get product reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.reviewer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    // Check if review can still be edited (within 7 days)
    const daysSinceCreation = (Date.now() - review.createdAt) / (1000 * 60 * 60 * 24);
    if (daysSinceCreation > 7) {
      return res.status(400).json({
        success: false,
        message: 'Reviews can only be edited within 7 days of creation'
      });
    }

    const { rating, title, comment } = req.body;

    review = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, title, comment, isEdited: true },
      { new: true, runValidators: true }
    ).populate('reviewer', 'name avatar');

    // Update user rating
    await updateUserRating(review.reviewedUser);

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating review',
      error: error.message
    });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.reviewer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    const reviewedUserId = review.reviewedUser;
    const serviceId = review.service;
    const productId = review.product;

    await review.deleteOne();

    // Update ratings
    await updateUserRating(reviewedUserId);
    if (serviceId) await updateServiceRating(serviceId);
    if (productId) await updateProductRating(productId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
      error: error.message
    });
  }
};

// @desc    Reply to a review (seller response)
// @route   POST /api/reviews/:id/reply
// @access  Private
exports.replyToReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Only reviewed user can reply
    if (review.reviewedUser.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the reviewed user can reply to this review'
      });
    }

    if (review.reply && review.reply.content) {
      return res.status(400).json({
        success: false,
        message: 'You have already replied to this review'
      });
    }

    review.reply = {
      content: req.body.reply,
      createdAt: new Date()
    };
    await review.save();

    res.json({
      success: true,
      message: 'Reply added successfully',
      data: review
    });
  } catch (error) {
    console.error('Reply to review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding reply',
      error: error.message
    });
  }
};

// Helper function to update user's average rating
async function updateUserRating(userId) {
  const result = await Review.aggregate([
    { $match: { reviewedUser: userId } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]);

  const rating = result.length > 0 ? Math.round(result[0].avgRating * 10) / 10 : 0;
  const reviewCount = result.length > 0 ? result[0].count : 0;

  await User.findByIdAndUpdate(userId, { rating, reviewCount });
}

// Helper function to update service rating
async function updateServiceRating(serviceId) {
  const result = await Review.aggregate([
    { $match: { service: serviceId } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]);

  const rating = result.length > 0 ? Math.round(result[0].avgRating * 10) / 10 : 0;
  const reviewCount = result.length > 0 ? result[0].count : 0;

  await Service.findByIdAndUpdate(serviceId, { rating, reviewCount });
}

// Helper function to update product rating
async function updateProductRating(productId) {
  const result = await Review.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]);

  const rating = result.length > 0 ? Math.round(result[0].avgRating * 10) / 10 : 0;
  const reviewCount = result.length > 0 ? result[0].count : 0;

  await Product.findByIdAndUpdate(productId, { rating, reviewCount });
}
