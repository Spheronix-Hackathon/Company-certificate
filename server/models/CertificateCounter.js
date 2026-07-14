const mongoose = require('mongoose');

const certificateCounterSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
    unique: true
  },
  sequenceValue: {
    type: Number,
    default: 0
  }
});

const CertificateCounter = mongoose.model('CertificateCounter', certificateCounterSchema);
module.exports = CertificateCounter;
