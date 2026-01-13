const express = require('express');
const router = express.Router();
const { Message, Conversation } = require('../models/Message');
const { protect } = require('../middleware/auth');

// @route   GET /api/messages/conversations
router.get('/conversations', protect, async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user.id, isActive: true })
      .populate('participants', 'firstName lastName avatar')
      .populate('project', 'title')
      .sort({ 'lastMessage.createdAt': -1 });
    res.json({ success: true, data: conversations });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/messages/conversation/:id
router.get('/conversation/:id', protect, async (req, res) => {
  try {
    const messages = await Message.find({ conversation: req.params.id })
      .populate('sender', 'firstName lastName avatar')
      .sort({ createdAt: 1 });

    // Mark as read
    await Message.updateMany(
      { conversation: req.params.id, sender: { $ne: req.user.id }, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/messages
router.post('/', protect, async (req, res) => {
  try {
    const { receiverId, content, projectId } = req.body;

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, receiverId] },
      project: projectId || null
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user.id, receiverId],
        project: projectId
      });
    }

    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user.id,
      content
    });

    // Update conversation
    conversation.lastMessage = {
      content,
      sender: req.user.id,
      createdAt: new Date()
    };
    await conversation.save();

    // Emit socket event
    const io = req.app.get('io');
    io.to(receiverId).emit('newMessage', {
      conversationId: conversation._id,
      message: await message.populate('sender', 'firstName lastName avatar')
    });

    res.status(201).json({ success: true, data: message });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/messages/start-conversation
router.post('/start-conversation', protect, async (req, res) => {
  try {
    const { receiverId, projectId, serviceId, initialMessage } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, receiverId] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user.id, receiverId],
        project: projectId,
        service: serviceId
      });
    }

    if (initialMessage) {
      const message = await Message.create({
        conversation: conversation._id,
        sender: req.user.id,
        content: initialMessage
      });

      conversation.lastMessage = {
        content: initialMessage,
        sender: req.user.id,
        createdAt: new Date()
      };
      await conversation.save();
    }

    res.status(201).json({ success: true, data: conversation });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
