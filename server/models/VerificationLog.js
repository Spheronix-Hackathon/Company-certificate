const mongoose = require('mongoose');

const verificationLogSchema = new mongoose.Schema({
  certificateId: { type: String, required: true },
  ipAddress: { type: String },
  country: { type: String },
  browser: { type: String },
  device: { type: String },
  result: { 
    type: String, 
    enum: ['Verified', 'Revoked', 'Expired', 'Not Found'],
    required: true 
  }
}, {
  timestamps: true
});

const VerificationLog = mongoose.model('VerificationLog', verificationLogSchema);
module.exports = VerificationLog;
