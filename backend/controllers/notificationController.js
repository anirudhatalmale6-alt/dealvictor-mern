const User = require('../models/User');

// Twilio setup - will be configured with real credentials
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID || 'test_sid';
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN || 'test_token';
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || '+1234567890';

let twilioClient;
try {
  const twilio = require('twilio');
  twilioClient = twilio(twilioAccountSid, twilioAuthToken);
} catch (e) {
  console.log('Twilio not configured - SMS disabled');
  twilioClient = null;
}

// Nodemailer setup for emails
const nodemailer = require('nodemailer');
const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER || 'test',
    pass: process.env.SMTP_PASS || 'test'
  }
});

// @desc    Send SMS notification
// @route   POST /api/notifications/sms
// @access  Private
exports.sendSMS = async (req, res) => {
  try {
    const { to, message } = req.body;

    if (!twilioClient) {
      return res.status(503).json({
        success: false,
        message: 'SMS service not configured'
      });
    }

    const result = await twilioClient.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to
    });

    res.json({
      success: true,
      message: 'SMS sent successfully',
      data: { sid: result.sid }
    });
  } catch (error) {
    console.error('Send SMS error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending SMS',
      error: error.message
    });
  }
};

// @desc    Send email notification
// @route   POST /api/notifications/email
// @access  Private
exports.sendEmail = async (req, res) => {
  try {
    const { to, subject, html, text } = req.body;

    const mailOptions = {
      from: `"DealVictor" <${process.env.FROM_EMAIL || 'noreply@dealvictor.com'}>`,
      to,
      subject,
      html,
      text
    };

    await emailTransporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: 'Email sent successfully'
    });
  } catch (error) {
    console.error('Send email error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending email',
      error: error.message
    });
  }
};

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly } = req.query;

    const user = await User.findById(req.user.id);
    let notifications = user.notifications || [];

    if (unreadOnly === 'true') {
      notifications = notifications.filter(n => !n.isRead);
    }

    // Sort by date descending
    notifications.sort((a, b) => b.createdAt - a.createdAt);

    // Paginate
    const skip = (Number(page) - 1) * Number(limit);
    const paginatedNotifications = notifications.slice(skip, skip + Number(limit));

    res.json({
      success: true,
      data: {
        notifications: paginatedNotifications,
        unreadCount: notifications.filter(n => !n.isRead).length,
        total: notifications.length
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message
    });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const notification = user.notifications.id(req.params.id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking notification as read',
      error: error.message
    });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.notifications.forEach(notification => {
      if (!notification.isRead) {
        notification.isRead = true;
        notification.readAt = new Date();
      }
    });

    await user.save();

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking notifications as read',
      error: error.message
    });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const notification = user.notifications.id(req.params.id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    notification.deleteOne();
    await user.save();

    res.json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting notification',
      error: error.message
    });
  }
};

// @desc    Update notification preferences
// @route   PUT /api/notifications/preferences
// @access  Private
exports.updatePreferences = async (req, res) => {
  try {
    const {
      emailNotifications,
      smsNotifications,
      pushNotifications,
      notifyOnNewBid,
      notifyOnMessage,
      notifyOnOrderUpdate,
      notifyOnPayment,
      marketingEmails
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        'settings.emailNotifications': emailNotifications,
        'settings.smsNotifications': smsNotifications,
        'settings.pushNotifications': pushNotifications,
        'notificationPreferences.notifyOnNewBid': notifyOnNewBid,
        'notificationPreferences.notifyOnMessage': notifyOnMessage,
        'notificationPreferences.notifyOnOrderUpdate': notifyOnOrderUpdate,
        'notificationPreferences.notifyOnPayment': notifyOnPayment,
        'notificationPreferences.marketingEmails': marketingEmails
      },
      { new: true }
    ).select('settings notificationPreferences');

    res.json({
      success: true,
      message: 'Notification preferences updated',
      data: {
        settings: user.settings,
        notificationPreferences: user.notificationPreferences
      }
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating preferences',
      error: error.message
    });
  }
};

// Helper function to create in-app notification
exports.createNotification = async (userId, notification) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    user.notifications = user.notifications || [];
    user.notifications.push({
      type: notification.type,
      title: notification.title,
      message: notification.message,
      link: notification.link,
      data: notification.data,
      createdAt: new Date()
    });

    // Keep only last 100 notifications
    if (user.notifications.length > 100) {
      user.notifications = user.notifications.slice(-100);
    }

    await user.save();

    // Send email if enabled
    if (user.settings?.emailNotifications) {
      try {
        await emailTransporter.sendMail({
          from: `"DealVictor" <${process.env.FROM_EMAIL || 'noreply@dealvictor.com'}>`,
          to: user.email,
          subject: notification.title,
          html: `<p>${notification.message}</p>${notification.link ? `<p><a href="${notification.link}">View Details</a></p>` : ''}`
        });
      } catch (e) {
        console.error('Email notification failed:', e);
      }
    }

    // Send SMS if enabled and phone available
    if (user.settings?.smsNotifications && user.phone && twilioClient) {
      try {
        await twilioClient.messages.create({
          body: `${notification.title}: ${notification.message}`,
          from: twilioPhoneNumber,
          to: user.phone
        });
      } catch (e) {
        console.error('SMS notification failed:', e);
      }
    }

    return true;
  } catch (error) {
    console.error('Create notification error:', error);
    return false;
  }
};

// Notification templates
exports.notificationTemplates = {
  newBid: (projectTitle, bidAmount) => ({
    type: 'bid',
    title: 'New Bid Received',
    message: `You received a new bid of $${bidAmount} on "${projectTitle}"`
  }),

  bidAccepted: (projectTitle) => ({
    type: 'bid',
    title: 'Bid Accepted!',
    message: `Your bid on "${projectTitle}" has been accepted`
  }),

  newOrder: (orderNumber, itemTitle) => ({
    type: 'order',
    title: 'New Order',
    message: `You have a new order #${orderNumber} for "${itemTitle}"`
  }),

  orderDelivered: (orderNumber) => ({
    type: 'order',
    title: 'Order Delivered',
    message: `Order #${orderNumber} has been marked as delivered`
  }),

  paymentReceived: (amount) => ({
    type: 'payment',
    title: 'Payment Received',
    message: `You received a payment of $${amount}`
  }),

  newMessage: (senderName) => ({
    type: 'message',
    title: 'New Message',
    message: `You have a new message from ${senderName}`
  }),

  reviewReceived: (rating, reviewerName) => ({
    type: 'review',
    title: 'New Review',
    message: `${reviewerName} left you a ${rating}-star review`
  }),

  membershipExpiring: (daysLeft) => ({
    type: 'membership',
    title: 'Membership Expiring Soon',
    message: `Your membership expires in ${daysLeft} days. Renew to keep your benefits.`
  }),

  bidsRecharged: (bidCount) => ({
    type: 'membership',
    title: 'Bids Recharged',
    message: `Your monthly bids have been recharged. You now have ${bidCount} bids available.`
  })
};
