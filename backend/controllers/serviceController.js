const Service = require('../models/Service');

// @desc    Create new service/gig
// @route   POST /api/services
// @access  Private
exports.createService = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      tags,
      packages,
      images,
      requirements,
      faqs
    } = req.body;

    const service = await Service.create({
      title,
      description,
      category,
      tags,
      packages,
      images,
      requirements,
      faqs,
      seller: req.user.id
    });

    await service.populate('seller', 'name avatar rating reviewCount');

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      service
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating service',
      error: error.message
    });
  }
};

// @desc    Get all services
// @route   GET /api/services
// @access  Public
exports.getServices = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      deliveryTime,
      search,
      sellerLevel,
      sort = '-createdAt'
    } = req.query;

    // Build query
    const query = { status: 'active' };

    if (category) query.category = category;

    if (minPrice || maxPrice) {
      query['packages.basic.price'] = {};
      if (minPrice) query['packages.basic.price'].$gte = Number(minPrice);
      if (maxPrice) query['packages.basic.price'].$lte = Number(maxPrice);
    }

    if (deliveryTime) {
      query['packages.basic.deliveryDays'] = { $lte: Number(deliveryTime) };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    // Build sort
    let sortOption = {};
    switch (sort) {
      case 'price_low':
        sortOption = { 'packages.basic.price': 1 };
        break;
      case 'price_high':
        sortOption = { 'packages.basic.price': -1 };
        break;
      case 'rating':
        sortOption = { rating: -1 };
        break;
      case 'orders':
        sortOption = { ordersCompleted: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const [services, total] = await Promise.all([
      Service.find(query)
        .populate('seller', 'name avatar rating reviewCount level country')
        .populate('category', 'name')
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit)),
      Service.countDocuments(query)
    ]);

    res.json({
      success: true,
      services,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching services',
      error: error.message
    });
  }
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
exports.getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('seller', 'name avatar rating reviewCount level country bio createdAt')
      .populate('category', 'name')
      .populate({
        path: 'reviews',
        populate: {
          path: 'user',
          select: 'name avatar country'
        },
        options: { limit: 10, sort: { createdAt: -1 } }
      });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Increment view count
    service.viewCount = (service.viewCount || 0) + 1;
    await service.save();

    res.json({
      success: true,
      service
    });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service',
      error: error.message
    });
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private (Service owner only)
exports.updateService = async (req, res) => {
  try {
    let service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check ownership
    if (service.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this service'
      });
    }

    const allowedUpdates = ['title', 'description', 'category', 'tags', 'packages', 'images', 'requirements', 'faqs', 'status'];
    const updates = {};

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    service = await Service.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('seller', 'name avatar rating');

    res.json({
      success: true,
      message: 'Service updated successfully',
      service
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating service',
      error: error.message
    });
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private (Service owner only)
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check ownership
    if (service.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this service'
      });
    }

    await service.deleteOne();

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting service',
      error: error.message
    });
  }
};

// @desc    Get my services
// @route   GET /api/services/my
// @access  Private
exports.getMyServices = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { seller: req.user.id };
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [services, total] = await Promise.all([
      Service.find(query)
        .populate('category', 'name')
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit)),
      Service.countDocuments(query)
    ]);

    res.json({
      success: true,
      services,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get my services error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching services',
      error: error.message
    });
  }
};

// @desc    Get services by seller
// @route   GET /api/services/seller/:sellerId
// @access  Public
exports.getSellerServices = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const query = {
      seller: req.params.sellerId,
      status: 'active'
    };

    const skip = (Number(page) - 1) * Number(limit);

    const [services, total] = await Promise.all([
      Service.find(query)
        .populate('category', 'name')
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit)),
      Service.countDocuments(query)
    ]);

    res.json({
      success: true,
      services,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get seller services error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching services',
      error: error.message
    });
  }
};
