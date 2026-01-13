const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

// Protected routes
router.get('/', protect, notificationController.getNotifications);
router.put('/:id/read', protect, notificationController.markAsRead);
router.put('/read-all', protect, notificationController.markAllAsRead);
router.delete('/:id', protect, notificationController.deleteNotification);
router.put('/preferences', protect, notificationController.updatePreferences);

// Admin routes for sending notifications
router.post('/sms', protect, authorize('admin'), notificationController.sendSMS);
router.post('/email', protect, authorize('admin'), notificationController.sendEmail);

module.exports = router;
