const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  shortDescription: {
    type: String,
    maxlength: [500, 'Short description cannot exceed 500 characters']
  },
  seller: {
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
  price: {
    regular: {
      type: Number,
      required: [true, 'Product price is required']
    },
    sale: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  inventory: {
    quantity: {
      type: Number,
      default: 0
    },
    sku: String,
    trackInventory: {
      type: Boolean,
      default: true
    },
    allowBackorders: {
      type: Boolean,
      default: false
    }
  },
  shipping: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    freeShipping: {
      type: Boolean,
      default: false
    },
    shippingCost: {
      type: Number,
      default: 0
    },
    deliveryTime: String // e.g., "3-5 business days"
  },
  attributes: [{
    name: String,
    value: String
  }],
  variations: [{
    name: String,
    options: [{
      value: String,
      priceAdjustment: Number,
      quantity: Number,
      sku: String
    }]
  }],
  tags: [String],
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive', 'out_of_stock', 'deleted'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  // Stats
  stats: {
    views: { type: Number, default: 0 },
    sales: { type: Number, default: 0 },
    avgRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 }
  },
  // SEO
  seo: {
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String]
  }
}, {
  timestamps: true
});

// Generate slug before saving
productSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + this._id.toString().slice(-6);
  }
  next();
});

// Virtual for current price
productSchema.virtual('currentPrice').get(function() {
  return this.price.sale || this.price.regular;
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.price.sale && this.price.regular) {
    return Math.round(((this.price.regular - this.price.sale) / this.price.regular) * 100);
  }
  return 0;
});

// Virtual for in stock status
productSchema.virtual('inStock').get(function() {
  return !this.inventory.trackInventory || this.inventory.quantity > 0 || this.inventory.allowBackorders;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

// Indexes
productSchema.index({ title: 'text', description: 'text', tags: 'text' });
productSchema.index({ seller: 1, status: 1 });
productSchema.index({ category: 1, status: 1, createdAt: -1 });
productSchema.index({ 'price.regular': 1 });

module.exports = mongoose.model('Product', productSchema);
