const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  general: {
    siteName: { type: String, default: 'DealVictor' },
    siteDescription: { type: String, default: 'Multi-purpose Marketplace' },
    siteUrl: { type: String },
    contactEmail: { type: String },
    supportPhone: { type: String },
    maintenanceMode: { type: Boolean, default: false },
    maintenanceMessage: { type: String }
  },

  memberships: [{
    name: { type: String, required: true },
    price: { type: Number, default: 0 },
    annualPrice: { type: Number, default: 0 },
    bidsPerMonth: { type: Number, default: 10 }, // -1 for unlimited
    platformFee: { type: Number, default: 10 }, // Percentage
    features: [{ type: String }],
    isPopular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  }],

  commissions: {
    defaultServiceFee: { type: Number, default: 10 },
    defaultProductFee: { type: Number, default: 8 },
    defaultProjectFee: { type: Number, default: 10 },
    minWithdrawal: { type: Number, default: 50 },
    withdrawalFee: { type: Number, default: 0 }
  },

  currencies: [{
    code: { type: String, required: true },
    symbol: { type: String, required: true },
    name: { type: String, required: true },
    exchangeRate: { type: Number, default: 1 },
    isDefault: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  }],

  payments: {
    stripeEnabled: { type: Boolean, default: true },
    stripePublishableKey: { type: String },
    paypalEnabled: { type: Boolean, default: false },
    paypalClientId: { type: String },
    escrowEnabled: { type: Boolean, default: true },
    escrowReleaseDays: { type: Number, default: 14 }
  },

  security: {
    maxLoginAttempts: { type: Number, default: 5 },
    lockoutDuration: { type: Number, default: 30 }, // minutes
    sessionTimeout: { type: Number, default: 60 }, // minutes
    requireEmailVerification: { type: Boolean, default: true },
    requirePhoneVerification: { type: Boolean, default: false },
    twoFactorEnabled: { type: Boolean, default: false }
  },

  notifications: {
    twilioEnabled: { type: Boolean, default: false },
    twilioAccountSid: { type: String },
    twilioAuthToken: { type: String },
    twilioPhoneNumber: { type: String },
    smtpHost: { type: String },
    smtpPort: { type: Number },
    smtpUser: { type: String },
    smtpPass: { type: String },
    fromEmail: { type: String },
    fromName: { type: String }
  },

  bidding: {
    minBidAmount: { type: Number, default: 5 },
    maxBidsPerProject: { type: Number, default: 50 },
    bidEditWindow: { type: Number, default: 24 }, // hours
    bidWithdrawEnabled: { type: Boolean, default: true }
  },

  content: {
    maxProjectTitleLength: { type: Number, default: 100 },
    maxProjectDescriptionLength: { type: Number, default: 5000 },
    maxImagesPerService: { type: Number, default: 5 },
    maxImagesPerProduct: { type: Number, default: 10 },
    allowedFileTypes: [{ type: String }],
    maxFileSize: { type: Number, default: 10 } // MB
  }
}, {
  timestamps: true
});

// Ensure only one settings document
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);
