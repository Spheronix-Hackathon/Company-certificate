const CertificateCounter = require('../models/CertificateCounter');

const generateCertificateId = async () => {
  const currentYear = new Date().getFullYear();
  
  const counter = await CertificateCounter.findOneAndUpdate(
    { year: currentYear },
    { $inc: { sequenceValue: 1 } },
    { new: true, upsert: true }
  );

  // Format: CERT-2026-000001
  const sequenceStr = counter.sequenceValue.toString().padStart(6, '0');
  return `CERT-${currentYear}-${sequenceStr}`;
};

module.exports = { generateCertificateId };
