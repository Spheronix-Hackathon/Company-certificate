const Certificate = require('../models/Certificate');
const VerificationLog = require('../models/VerificationLog');

// @desc    Verify certificate by ID (Public)
// @route   GET /api/verify/:certificateId
// @access  Public
const verifyCertificate = async (req, res, next) => {
  try {
    const { certificateId } = req.params;
    
    // Extract IP and basic client info
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const browser = req.headers['user-agent'];
    
    const certificate = await Certificate.findOne({ certificateId, isDeleted: false });
    
    if (!certificate) {
      // Log Not Found
      await VerificationLog.create({
        certificateId,
        ipAddress,
        browser,
        result: 'Not Found'
      });
      return res.status(404).json({ success: false, message: 'Certificate Not Found' });
    }

    // Log Verification attempt
    const log = await VerificationLog.create({
      certificateId,
      ipAddress,
      browser,
      result: certificate.status
    });

    res.json({
      success: true,
      certificate: {
        studentName: certificate.studentName,
        certificateId: certificate.certificateId,
        internshipRole: certificate.internshipRole,
        college: certificate.college,
        duration: certificate.duration,
        issuedDate: certificate.issuedDate,
        status: certificate.status,
        companyName: 'Tech Innovators Inc.', // In reality, fetch from CompanySettings or inject via Service
        pdfPath: certificate.pdfPath
      },
      verificationTime: new Date().toISOString(),
      verificationId: log._id
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { verifyCertificate };
