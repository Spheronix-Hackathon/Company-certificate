const Certificate = require('../models/Certificate');
const ActivityLog = require('../models/ActivityLog');
const { generateCertificateId } = require('../utils/idGenerator');
const { generateQR } = require('./qr.service');
const { generatePDF } = require('./pdf.service');

const createCertificate = async (certificateData, adminId) => {
  try {
    // 1. Generate sequential ID
    const certificateId = await generateCertificateId();
    
    // 2. Create Verification URL
    const frontendUrl = process.env.FRONTEND_URL;
    const verificationUrl = `${frontendUrl}/verify/${certificateId}`;

    // 3. Generate QR Code
    const qrPath = await generateQR(certificateId, verificationUrl);

    // 4. Store in DB (Draft / Pending)
    const certificate = await Certificate.create({
      ...certificateData,
      certificateId,
      verificationUrl,
      qrPath,
      createdBy: adminId
    });

    // 5. Generate PDF
    const pdfPath = await generatePDF(certificate, qrPath);
    
    // 6. Update DB with PDF Path and Status
    certificate.pdfPath = pdfPath;
    certificate.status = 'Verified'; // Assuming generation finalizes it
    await certificate.save();

    // 7. Log Activity
    await ActivityLog.create({
      user: adminId,
      action: 'Generated Certificate',
      details: `Generated ID: ${certificateId} for ${certificate.studentName}`
    });

    return certificate;
  } catch (error) {
    console.error('Certificate Creation Flow Error:', error);
    throw new Error('Failed to create certificate: ' + error.message);
  }
};

module.exports = { createCertificate };
