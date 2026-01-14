const mongoose = require('mongoose');
const slugify = require('slugify');

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['basic', 'standard', 'premium'],
    required: true
  },
  title: String,
  description: String,
  price: {
    type: Number,
    required: true
  },
  deliveryTime: {
    value: Number,
    unit: {
      type: String,
      enum: ['hours', 'days', 'weeks'],
      default: 'days'
    }
  },
  revisions: {
    type: Number,
    default: 1
  },
  features: [String]
});

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Service title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Service description is required']
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: { type: Boolean, default: false }
  }],
  video: {
    url: String,
    thumbnail: String
  },
  packages: [packageSchema],
  // For simple pricing (if not using packages)
  startingPrice: Number,
  tags: [String],
  requirements: [{
    question: String,
    type: {
      type: String,
      enum: ['text', 'textarea', 'file', 'multiple_choice'],
      default: 'text'
    },
    required: { type: Boolean, default: false },
    options: [String] // For multiple choice
  }],
  faqs: [{
    question: String,
    answer: String
  }],
  status: {
    type: String,
    enum: ['draft', 'pending', 'active', 'paused', 'rejected', 'deleted'],
    default: 'pending'
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  rejectionReason: String,
  featured: {
    type: Boolean,
    default: false
  },
  // Stats
  stats: {
    views: { type: Number, default: 0 },
    orders: { type: Number, default: 0 },
    completedOrders: { type: Number, default: 0 },
    avgRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    responseTime: String // e.g., "1 hour"
  },
  // Location based services
  isLocal: {
    type: Boolean,
    default: false
  },
  serviceArea: {
    city: String,
    state: String,
    country: String,
    radius: Number // in km
  }
}, {
  timestamps: true
});

// Generate slug before saving
serviceSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + this._id.toString().slice(-6);
  }
  next();
});

// Calculate starting price from packages
serviceSchema.pre('save', function(next) {
  if (this.packages && this.packages.length > 0) {
    this.startingPrice = Math.min(...this.packages.map(p => p.price));
  }
  next();
});

// Indexes
serviceSchema.index({ title: 'text', description: 'text', tags: 'text' });
serviceSchema.index({ freelancer: 1, status: 1 });
serviceSchema.index({ category: 1, status: 1, 'stats.avgRating': -1 });
serviceSchema.index({ startingPrice: 1 });

module.exports = mongoose.model('Service', serviceSchema);
