const mongoose = require('mongoose');

const companySettingSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  logoPath: { type: String }, // Path to uploaded logo
  address: { type: String },
  email: { type: String },
  phone: { type: String },
  website: { type: String },
  signaturePath: { type: String }, // Path to uploaded signature
  certificateBackgroundPath: { type: String }, // Optional template background
  themeColor: { type: String, default: '#3b82f6' }
}, {
  timestamps: true
});

const CompanySetting = mongoose.model('CompanySetting', companySettingSchema);
module.exports = CompanySetting;
