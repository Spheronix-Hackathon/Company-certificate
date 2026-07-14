const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    required: true,
    unique: true
  },
  studentName: { type: String, required: true },
  regdNo: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  college: { type: String, required: true },
  department: { type: String }, // Made optional
  internshipType: { type: String, required: true }, // e.g., 'Short-term'
  programName: { type: String, required: true }, // e.g., 'AI-INTEGRATED FULL STACK DEVELOPMENT'
  internshipRole: { type: String }, // Made optional
  duration: { type: String }, // Made optional
  startDate: { type: Date },
  endDate: { type: Date },
  issuedDate: { type: Date, default: Date.now },
  mentorName: { type: String },
  status: {
    type: String,
    enum: ['Draft', 'Pending', 'Verified', 'Revoked', 'Expired'],
    default: 'Pending'
  },
  verificationUrl: { type: String },
  qrPath: { type: String },
  pdfPath: { type: String },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

const Certificate = mongoose.model('Certificate', certificateSchema);
module.exports = Certificate;
