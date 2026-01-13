const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  phone: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  role: {
    type: String,
    enum: ['buyer', 'freelancer', 'seller', 'admin'],
    default: 'buyer'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Freelancer specific fields
  freelancerProfile: {
    title: String,
    description: String,
    skills: [String],
    hourlyRate: Number,
    experience: String,
    portfolio: [{
      title: String,
      description: String,
      image: String,
      link: String
    }],
    education: [{
      degree: String,
      institution: String,
      year: Number
    }],
    languages: [String],
    availability: {
      type: String,
      enum: ['full-time', 'part-time', 'hourly'],
      default: 'full-time'
    }
  },
  // Seller specific fields
  sellerProfile: {
    shopName: String,
    shopDescription: String,
    shopLogo: String,
    shopBanner: String,
    businessAddress: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    },
    businessPhone: String,
    businessEmail: String
  },
  // Location
  location: {
    city: String,
    state: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  // Stats
  stats: {
    totalProjects: { type: Number, default: 0 },
    completedProjects: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    avgRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 }
  },
  // Wallet/Balance
  balance: { type: Number, default: 0 },
  pendingWithdrawal: { type: Number, default: 0 },
  totalWithdrawn: { type: Number, default: 0 },

  // Membership
  membership: {
    plan: { type: String, enum: ['free', 'starter', 'pro', 'business'], default: 'free' },
    billingCycle: { type: String, enum: ['monthly', 'annual'], default: 'monthly' },
    bidsPerMonth: { type: Number, default: 10 },
    bidsRemaining: { type: Number, default: 10 },
    platformFee: { type: Number, default: 10 },
    expiresAt: { type: Date },
    nextBidRecharge: { type: Date },
    isActive: { type: Boolean, default: true }
  },

  // Multiple roles support
  roles: [{
    type: String,
    enum: ['buyer', 'freelancer', 'seller', 'admin']
  }],

  // Suspension status
  isSuspended: { type: Boolean, default: false },
  suspendedAt: { type: Date },
  suspensionReason: { type: String },

  // Rating
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },

  // Online status
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date },
  lastLogin: { type: Date },

  // Withdrawal requests
  withdrawalRequests: [{
    amount: { type: Number, required: true },
    paymentMethod: { type: String },
    paymentDetails: { type: mongoose.Schema.Types.Mixed },
    status: { type: String, enum: ['pending', 'processing', 'completed', 'rejected'], default: 'pending' },
    requestedAt: { type: Date, default: Date.now },
    processedAt: { type: Date },
    transactionId: { type: String },
    rejectionReason: { type: String }
  }],

  // In-app notifications
  notifications: [{
    type: { type: String },
    title: { type: String },
    message: { type: String },
    link: { type: String },
    data: { type: mongoose.Schema.Types.Mixed },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
  }],

  // Notification settings
  settings: {
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    pushNotifications: { type: Boolean, default: true },
    currency: { type: String, default: 'USD' },
    language: { type: String, default: 'en' },
    timezone: { type: String, default: 'UTC' },
    profileVisibility: { type: String, enum: ['public', 'private'], default: 'public' }
  },

  // Notification preferences
  notificationPreferences: {
    notifyOnNewBid: { type: Boolean, default: true },
    notifyOnMessage: { type: Boolean, default: true },
    notifyOnOrderUpdate: { type: Boolean, default: true },
    notifyOnPayment: { type: Boolean, default: true },
    marketingEmails: { type: Boolean, default: false }
  },
  // Reset password
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  // Email verification
  verificationToken: String,
  verificationExpire: Date
}, {
  timestamps: true
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Get full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtuals are included in JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
