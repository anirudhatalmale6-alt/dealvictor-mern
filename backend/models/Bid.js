const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Bid amount is required']
  },
  currency: {
    type: String,
    default: 'USD'
  },
  deliveryTime: {
    value: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      enum: ['hours', 'days', 'weeks', 'months'],
      default: 'days'
    }
  },
  proposal: {
    type: String,
    required: [true, 'Proposal description is required'],
    minlength: [50, 'Proposal must be at least 50 characters']
  },
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number
  }],
  status: {
    type: String,
    enum: ['pending', 'shortlisted', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  milestones: [{
    title: String,
    description: String,
    amount: Number,
    deliveryDays: Number
  }],
  isSealed: {
    type: Boolean,
    default: false
  },
  // Communication
  buyerViewed: {
    type: Boolean,
    default: false
  },
  buyerViewedAt: Date,
  // Awarded
  awardedAt: Date,
  rejectedAt: Date,
  withdrawnAt: Date,
  rejectionReason: String
}, {
  timestamps: true
});

// Compound index to ensure one bid per freelancer per project
bidSchema.index({ project: 1, freelancer: 1 }, { unique: true });
bidSchema.index({ freelancer: 1, status: 1 });
bidSchema.index({ project: 1, status: 1, amount: 1 });

module.exports = mongoose.model('Bid', bidSchema);
