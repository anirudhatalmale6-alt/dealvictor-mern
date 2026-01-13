const Order = require('../models/Order');
const Service = require('../models/Service');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Create new order (service or product)
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const {
      type, // 'service' or 'product'
      itemId,
      packageType, // for services: 'basic', 'standard', 'premium'
      quantity, // for products
      requirements,
      shippingAddress // for products
    } = req.body;

    let orderData = {
      buyer: req.user.id,
      type
    };

    if (type === 'service') {
      const service = await Service.findById(itemId);
      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }

      const selectedPackage = service.packages[packageType] || service.packages.basic;

      orderData.service = itemId;
      orderData.seller = service.seller;
      orderData.packageType = packageType || 'basic';
      orderData.amount = selectedPackage.price;
      orderData.deliveryDays = selectedPackage.deliveryDays;
      orderData.requirements = requirements;

    } else if (type === 'product') {
      const product = await Product.findById(itemId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Check stock
      if (product.inventory.quantity < quantity) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient stock'
        });
      }

      orderData.product = itemId;
      orderData.seller = product.seller;
      orderData.quantity = quantity || 1;
      orderData.amount = product.price * (quantity || 1);
      orderData.shippingAddress = shippingAddress;

      // Reduce stock
      product.inventory.quantity -= quantity || 1;
      await product.save();
    }

    // Calculate platform fee based on seller's membership
    const seller = await User.findById(orderData.seller);
    const platformFeePercent = seller.membership?.platformFee || 10;
    orderData.platformFee = (orderData.amount * platformFeePercent) / 100;
    orderData.sellerEarning = orderData.amount - orderData.platformFee;

    const order = await Order.create(orderData);

    await order.populate([
      { path: 'buyer', select: 'name email avatar' },
      { path: 'seller', select: 'name email avatar' },
      { path: 'service', select: 'title images' },
      { path: 'product', select: 'name images' }
    ]);

    // TODO: Create payment intent / escrow

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// @desc    Get my orders (as buyer)
// @route   GET /api/orders/my/buying
// @access  Private
exports.getMyBuyingOrders = async (req, res) => {
  try {
    const { status, type, page = 1, limit = 10 } = req.query;

    const query = { buyer: req.user.id };
    if (status) query.status = status;
    if (type) query.type = type;

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('seller', 'name avatar')
        .populate('service', 'title images')
        .populate('product', 'name images')
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(query)
    ]);

    res.json({
      success: true,
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get my buying orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// @desc    Get my orders (as seller)
// @route   GET /api/orders/my/selling
// @access  Private
exports.getMySellingOrders = async (req, res) => {
  try {
    const { status, type, page = 1, limit = 10 } = req.query;

    const query = { seller: req.user.id };
    if (status) query.status = status;
    if (type) query.type = type;

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('buyer', 'name avatar')
        .populate('service', 'title images')
        .populate('product', 'name images')
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(query)
    ]);

    res.json({
      success: true,
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get my selling orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name email avatar')
      .populate('seller', 'name email avatar')
      .populate('service', 'title description images packages')
      .populate('product', 'name description images price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is buyer or seller
    if (
      order.buyer._id.toString() !== req.user.id &&
      order.seller._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Validate status transitions
    const validTransitions = {
      pending: ['paid', 'cancelled'],
      paid: ['in_progress', 'cancelled'],
      in_progress: ['delivered', 'cancelled'],
      delivered: ['completed', 'revision'],
      revision: ['delivered'],
      completed: [],
      cancelled: []
    };

    if (!validTransitions[order.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${order.status} to ${status}`
      });
    }

    // Check authorization based on status change
    const isBuyer = order.buyer.toString() === req.user.id;
    const isSeller = order.seller.toString() === req.user.id;

    if (status === 'delivered' && !isSeller) {
      return res.status(403).json({
        success: false,
        message: 'Only seller can mark as delivered'
      });
    }

    if (status === 'completed' && !isBuyer) {
      return res.status(403).json({
        success: false,
        message: 'Only buyer can mark as completed'
      });
    }

    order.status = status;

    if (status === 'delivered') {
      order.deliveredAt = new Date();
    }

    if (status === 'completed') {
      order.completedAt = new Date();
      // TODO: Release payment to seller

      // Update service/product sales count
      if (order.type === 'service') {
        await Service.findByIdAndUpdate(order.service, {
          $inc: { ordersCompleted: 1 }
        });
      } else {
        await Product.findByIdAndUpdate(order.product, {
          $inc: { salesCount: order.quantity || 1 }
        });
      }
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order status updated',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
};

// @desc    Submit delivery
// @route   PUT /api/orders/:id/deliver
// @access  Private (Seller only)
exports.submitDelivery = async (req, res) => {
  try {
    const { message, attachments } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.seller.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only seller can submit delivery'
      });
    }

    order.delivery = {
      message,
      attachments,
      submittedAt: new Date()
    };
    order.status = 'delivered';
    order.deliveredAt = new Date();

    await order.save();

    res.json({
      success: true,
      message: 'Delivery submitted successfully',
      order
    });
  } catch (error) {
    console.error('Submit delivery error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting delivery',
      error: error.message
    });
  }
};

// @desc    Request revision
// @route   PUT /api/orders/:id/revision
// @access  Private (Buyer only)
exports.requestRevision = async (req, res) => {
  try {
    const { message } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.buyer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only buyer can request revision'
      });
    }

    if (order.status !== 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Can only request revision after delivery'
      });
    }

    order.revisions = order.revisions || [];
    order.revisions.push({
      message,
      requestedAt: new Date()
    });
    order.status = 'revision';
    order.revisionCount = (order.revisionCount || 0) + 1;

    await order.save();

    res.json({
      success: true,
      message: 'Revision requested',
      order
    });
  } catch (error) {
    console.error('Request revision error:', error);
    res.status(500).json({
      success: false,
      message: 'Error requesting revision',
      error: error.message
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const isBuyer = order.buyer.toString() === req.user.id;
    const isSeller = order.seller.toString() === req.user.id;

    if (!isBuyer && !isSeller && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Only allow cancellation of pending or paid orders
    if (!['pending', 'paid'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order in current status'
      });
    }

    order.status = 'cancelled';
    order.cancellation = {
      by: req.user.id,
      reason,
      cancelledAt: new Date()
    };

    // Restore product stock if applicable
    if (order.type === 'product' && order.product) {
      await Product.findByIdAndUpdate(order.product, {
        $inc: { 'inventory.quantity': order.quantity || 1 }
      });
    }

    // TODO: Process refund if payment was made

    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling order',
      error: error.message
    });
  }
};
