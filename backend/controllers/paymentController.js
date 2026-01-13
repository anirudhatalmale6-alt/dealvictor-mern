const User = require('../models/User');
const Order = require('../models/Order');
const Project = require('../models/Project');

// Stripe test mode - will be replaced with real keys
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

// @desc    Create payment intent for order
// @route   POST /api/payments/create-intent
// @access  Private
exports.createPaymentIntent = async (req, res) => {
  try {
    const { orderId, amount, currency = 'usd' } = req.body;

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        orderId,
        userId: req.user.id
      }
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating payment',
      error: error.message
    });
  }
};

// @desc    Confirm payment and update order
// @route   POST /api/payments/confirm
// @access  Private
exports.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed'
      });
    }

    // Update order status
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = 'paid';
    order.paymentId = paymentIntentId;
    order.paidAt = new Date();
    await order.save();

    res.json({
      success: true,
      message: 'Payment confirmed',
      data: order
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error confirming payment',
      error: error.message
    });
  }
};

// @desc    Create payment for project milestone
// @route   POST /api/payments/milestone
// @access  Private
exports.createMilestonePayment = async (req, res) => {
  try {
    const { projectId, milestoneId, amount, currency = 'usd' } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Verify user is the client
    if (project.client.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency.toLowerCase(),
      metadata: {
        projectId,
        milestoneId,
        userId: req.user.id,
        type: 'milestone'
      }
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Create milestone payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating milestone payment',
      error: error.message
    });
  }
};

// @desc    Release milestone payment to freelancer
// @route   POST /api/payments/release-milestone
// @access  Private
exports.releaseMilestonePayment = async (req, res) => {
  try {
    const { projectId, milestoneId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Only client can release payment
    if (project.client.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const milestone = project.milestones.id(milestoneId);
    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found'
      });
    }

    if (milestone.status !== 'funded') {
      return res.status(400).json({
        success: false,
        message: 'Milestone is not funded or already released'
      });
    }

    // Calculate freelancer earnings (minus platform fee)
    const freelancer = await User.findById(project.freelancer);
    const platformFee = freelancer.membership?.platformFee || 10;
    const feeAmount = (milestone.amount * platformFee) / 100;
    const freelancerEarnings = milestone.amount - feeAmount;

    // Update milestone
    milestone.status = 'released';
    milestone.releasedAt = new Date();

    // Add to freelancer balance
    freelancer.balance = (freelancer.balance || 0) + freelancerEarnings;
    await freelancer.save();

    // Update project
    project.totalPaid = (project.totalPaid || 0) + milestone.amount;
    await project.save();

    res.json({
      success: true,
      message: 'Payment released to freelancer',
      data: {
        milestoneAmount: milestone.amount,
        platformFee: feeAmount,
        freelancerEarnings
      }
    });
  } catch (error) {
    console.error('Release milestone error:', error);
    res.status(500).json({
      success: false,
      message: 'Error releasing payment',
      error: error.message
    });
  }
};

// @desc    Process subscription payment
// @route   POST /api/payments/subscription
// @access  Private
exports.createSubscription = async (req, res) => {
  try {
    const { plan, billingCycle } = req.body;

    const membershipPlans = {
      starter: { monthly: 19, annual: 149, bidsPerMonth: 50, platformFee: 7 },
      pro: { monthly: 49, annual: 399, bidsPerMonth: 150, platformFee: 5 },
      business: { monthly: 99, annual: 799, bidsPerMonth: -1, platformFee: 3 }
    };

    const selectedPlan = membershipPlans[plan];
    if (!selectedPlan) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan selected'
      });
    }

    const amount = billingCycle === 'annual' ? selectedPlan.annual : selectedPlan.monthly;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      metadata: {
        userId: req.user.id,
        plan,
        billingCycle,
        type: 'subscription'
      }
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating subscription',
      error: error.message
    });
  }
};

// @desc    Confirm subscription and update user membership
// @route   POST /api/payments/confirm-subscription
// @access  Private
exports.confirmSubscription = async (req, res) => {
  try {
    const { paymentIntentId, plan, billingCycle } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed'
      });
    }

    const membershipPlans = {
      starter: { bidsPerMonth: 50, platformFee: 7 },
      pro: { bidsPerMonth: 150, platformFee: 5 },
      business: { bidsPerMonth: -1, platformFee: 3 }
    };

    const selectedPlan = membershipPlans[plan];
    const expiresAt = new Date();

    if (billingCycle === 'annual') {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    } else {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    }

    // Calculate next bid recharge date (first of next month)
    const nextBidRecharge = new Date();
    nextBidRecharge.setMonth(nextBidRecharge.getMonth() + 1);
    nextBidRecharge.setDate(1);
    nextBidRecharge.setHours(0, 0, 0, 0);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        membership: {
          plan,
          billingCycle,
          bidsPerMonth: selectedPlan.bidsPerMonth,
          bidsRemaining: selectedPlan.bidsPerMonth,
          platformFee: selectedPlan.platformFee,
          expiresAt,
          nextBidRecharge,
          isActive: true
        }
      },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Subscription activated successfully',
      data: user.membership
    });
  } catch (error) {
    console.error('Confirm subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Error confirming subscription',
      error: error.message
    });
  }
};

// @desc    Get payment history
// @route   GET /api/payments/history
// @access  Private
exports.getPaymentHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Get orders (both as buyer and seller)
    const orders = await Order.find({
      $or: [{ buyer: req.user.id }, { seller: req.user.id }],
      status: { $in: ['paid', 'completed'] }
    })
      .populate('service', 'title')
      .populate('product', 'name')
      .sort('-paidAt')
      .skip(skip)
      .limit(Number(limit));

    const paymentHistory = orders.map(order => ({
      id: order._id,
      type: order.buyer.toString() === req.user.id ? 'payment' : 'earning',
      amount: order.price,
      description: order.service?.title || order.product?.name || 'Order',
      date: order.paidAt,
      status: order.status
    }));

    res.json({
      success: true,
      data: paymentHistory
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment history',
      error: error.message
    });
  }
};

// @desc    Stripe webhook handler
// @route   POST /api/payments/webhook
// @access  Public
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      // Handle successful payment
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      // Handle failed payment
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

// @desc    Get Stripe public key
// @route   GET /api/payments/config
// @access  Public
exports.getStripeConfig = async (req, res) => {
  res.json({
    success: true,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder'
  });
};
