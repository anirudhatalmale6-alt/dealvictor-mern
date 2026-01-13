const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Reference to what is being reviewed
  reviewType: {
    type: String,
    enum: ['project', 'service', 'product', 'user'],
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  // Detailed ratings (optional)
  detailedRatings: {
    communication: { type: Number, min: 1, max: 5 },
    quality: { type: Number, min: 1, max: 5 },
    expertise: { type: Number, min: 1, max: 5 },
    professionalism: { type: Number, min: 1, max: 5 },
    delivery: { type: Number, min: 1, max: 5 }
  },
  title: {
    type: String,
    maxlength: 200
  },
  comment: {
    type: String,
    required: true,
    maxlength: 2000
  },
  // Response from reviewee
  response: {
    content: String,
    createdAt: Date
  },
  // Moderation
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'hidden'],
    default: 'approved'
  },
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  helpful: {
    count: { type: Number, default: 0 },
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  }
}, {
  timestamps: true
});

// Compound indexes
reviewSchema.index({ reviewee: 1, status: 1, createdAt: -1 });
reviewSchema.index({ product: 1, status: 1, createdAt: -1 });
reviewSchema.index({ service: 1, status: 1, createdAt: -1 });
reviewSchema.index({ project: 1, status: 1 });

// Prevent duplicate reviews
reviewSchema.index(
  { reviewer: 1, project: 1 },
  { unique: true, partialFilterExpression: { project: { $exists: true } } }
);
reviewSchema.index(
  { reviewer: 1, order: 1 },
  { unique: true, partialFilterExpression: { order: { $exists: true } } }
);

module.exports = mongoose.model('Review', reviewSchema);
