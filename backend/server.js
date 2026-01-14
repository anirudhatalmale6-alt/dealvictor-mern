const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const projectRoutes = require('./routes/projects');
const bidRoutes = require('./routes/bids');
const serviceRoutes = require('./routes/services');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const messageRoutes = require('./routes/messages');
const reviewRoutes = require('./routes/reviews');
const categoryRoutes = require('./routes/categories');
const adminRoutes = require('./routes/admin');
const paymentRoutes = require('./routes/payments');
const notificationRoutes = require('./routes/notifications');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Socket.io setup for real-time messaging
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'DealVictor API is running' });
});

// Track online users
const onlineUsers = new Map();

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user to their personal room and mark as online
  socket.on('join', async (userId) => {
    socket.join(userId);
    socket.userId = userId;
    onlineUsers.set(userId, socket.id);

    // Update user's online status in database
    try {
      const User = require('./models/User');
      await User.findByIdAndUpdate(userId, {
        isOnline: true,
        lastSeen: new Date()
      });
    } catch (err) {
      console.error('Error updating user online status:', err);
    }

    // Broadcast to all users that this user is online
    io.emit('userOnline', userId);
    console.log(`User ${userId} joined their room and is now online`);
  });

  // Handle private messages
  socket.on('sendMessage', async (data) => {
    const { senderId, receiverId, message } = data;

    // Emit to receiver
    io.to(receiverId).emit('newMessage', {
      senderId,
      message,
      timestamp: new Date()
    });

    // Also emit to sender for confirmation
    io.to(senderId).emit('messageSent', {
      receiverId,
      message,
      timestamp: new Date()
    });
  });

  // Handle typing indicator
  socket.on('typing', (data) => {
    socket.to(data.receiverId).emit('userTyping', {
      senderId: data.senderId
    });
  });

  // Handle stop typing
  socket.on('stopTyping', (data) => {
    socket.to(data.receiverId).emit('userStoppedTyping', {
      senderId: data.senderId
    });
  });

  // Handle read receipts
  socket.on('messageRead', (data) => {
    const { senderId, messageId } = data;
    io.to(senderId).emit('messageRead', {
      messageId,
      readAt: new Date()
    });
  });

  socket.on('disconnect', async () => {
    const userId = socket.userId;
    if (userId) {
      onlineUsers.delete(userId);

      // Update user's offline status in database
      try {
        const User = require('./models/User');
        await User.findByIdAndUpdate(userId, {
          isOnline: false,
          lastSeen: new Date()
        });
      } catch (err) {
        console.error('Error updating user offline status:', err);
      }

      // Broadcast to all users that this user is offline
      io.emit('userOffline', userId);
    }
    console.log('User disconnected:', socket.id);
  });
});

// Endpoint to get online users
app.get('/api/users/online', (req, res) => {
  res.json({
    success: true,
    onlineUsers: Array.from(onlineUsers.keys())
  });
});

// Make io accessible to routes
app.set('io', io);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Database connection and server start
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dealvictor')
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = { app, io };
