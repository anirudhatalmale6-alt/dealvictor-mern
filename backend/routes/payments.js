const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Order = require('../models/Order');

// @route   POST /api/payments/create-payment-intent
router.post('/create-payment-intent', protect, async (req, res) => {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const { amount, orderId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: { orderId, userId: req.user.id }
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Payment error' });
  }
});

// @route   POST /api/payments/confirm
router.post('/confirm', protect, async (req, res) => {
  try {
    const { orderId, paymentIntentId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.payment.status = 'completed';
    order.payment.transactionId = paymentIntentId;
    order.payment.paidAt = new Date();
    order.status = 'confirmed';
    order.confirmedAt = new Date();
    await order.save();

    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/payments/webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata.orderId;

        await Order.findByIdAndUpdate(orderId, {
          'payment.status': 'completed',
          'payment.transactionId': paymentIntent.id,
          'payment.paidAt': new Date(),
          status: 'confirmed',
          confirmedAt: new Date()
        });
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        await Order.findByIdAndUpdate(failedPayment.metadata.orderId, {
          'payment.status': 'failed'
        });
        break;
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// @route   POST /api/payments/escrow/fund
router.post('/escrow/fund', protect, async (req, res) => {
  try {
    const { projectId, amount } = req.body;
    const Project = require('../models/Project');

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    project.escrowAmount += amount;
    await project.save();

    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/payments/escrow/release
router.post('/escrow/release', protect, async (req, res) => {
  try {
    const { projectId, milestoneId, amount } = req.body;
    const Project = require('../models/Project');
    const User = require('../models/User');

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Only buyer can release
    if (project.buyer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Update milestone
    if (milestoneId) {
      const milestone = project.milestones.id(milestoneId);
      if (milestone) {
        milestone.status = 'paid';
        milestone.paidAt = new Date();
      }
    }

    project.escrowAmount -= amount;
    project.totalPaid += amount;
    await project.save();

    // Add to freelancer balance
    await User.findByIdAndUpdate(project.freelancer, {
      $inc: { 'balance.available': amount * 0.95 } // 5% platform fee
    });

    res.json({ success: true, message: 'Payment released' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
