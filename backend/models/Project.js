const mongoose = require('mongoose');
const slugify = require('slugify');

const milestoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  amount: {
    type: Number,
    required: true
  },
  dueDate: Date,
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'submitted', 'revision', 'approved', 'paid'],
    default: 'pending'
  },
  deliverables: [{
    file: String,
    description: String,
    uploadedAt: Date
  }],
  paidAt: Date
});

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Project description is required']
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
  skills: [{
    type: String,
    trim: true
  }],
  budget: {
    type: {
      type: String,
      enum: ['fixed', 'hourly'],
      default: 'fixed'
    },
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  duration: {
    type: String,
    enum: ['less_than_week', '1_2_weeks', '2_4_weeks', '1_3_months', '3_6_months', 'more_than_6_months']
  },
  experienceLevel: {
    type: String,
    enum: ['entry', 'intermediate', 'expert'],
    default: 'intermediate'
  },
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    uploadedAt: { type: Date, default: Date.now }
  }],
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  awardedBid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bid'
  },
  status: {
    type: String,
    enum: ['draft', 'open', 'in_progress', 'completed', 'cancelled', 'disputed'],
    default: 'open'
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'invite_only'],
    default: 'public'
  },
  milestones: [milestoneSchema],
  totalBids: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  // Dates
  deadline: Date,
  startedAt: Date,
  completedAt: Date,
  // Payment
  escrowAmount: {
    type: Number,
    default: 0
  },
  totalPaid: {
    type: Number,
    default: 0
  },
  // Location preference
  preferredLocation: {
    type: String,
    enum: ['any', 'local', 'remote'],
    default: 'any'
  }
}, {
  timestamps: true
});

// Generate slug before saving
projectSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + this._id.toString().slice(-6);
  }
  next();
});

// Index for search
projectSchema.index({ title: 'text', description: 'text', skills: 'text' });
projectSchema.index({ status: 1, category: 1, createdAt: -1 });

module.exports = mongoose.model('Project', projectSchema);
