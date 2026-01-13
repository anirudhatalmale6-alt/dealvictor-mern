const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// @route   GET /api/orders
router.get('/', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    let query = { buyer: req.user.id };
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('items.product', 'title images')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);
    res.json({ success: true, data: orders, pagination: { page: parseInt(page), total } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/orders/seller
router.get('/seller', protect, async (req, res) => {
  try {
    const orders = await Order.find({ 'items.seller': req.user.id })
      .populate('buyer', 'firstName lastName email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/orders/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'firstName lastName email')
      .populate('items.product');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/orders
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product).populate('seller');
      if (!product) continue;

      const itemSubtotal = (product.price.sale || product.price.regular) * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        product: product._id,
        seller: product.seller._id,
        title: product.title,
        image: product.images[0]?.url,
        price: product.price.sale || product.price.regular,
        quantity: item.quantity,
        subtotal: itemSubtotal
      });
    }

    const shippingCost = subtotal > 100 ? 0 : 10;
    const total = subtotal + shippingCost;

    const order = await Order.create({
      buyer: req.user.id,
      items: orderItems,
      shippingAddress,
      pricing: { subtotal, shippingCost, total },
      payment: { method: paymentMethod }
    });

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/orders/:id/status
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, [`${status}At`]: new Date() },
      { new: true }
    );
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
