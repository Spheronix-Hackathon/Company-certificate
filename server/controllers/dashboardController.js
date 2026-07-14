const Certificate = require('../models/Certificate');
const VerificationLog = require('../models/VerificationLog');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const totalCertificates = await Certificate.countDocuments({ isDeleted: false });
    
    // Status breakdown
    const verifiedCount = await Certificate.countDocuments({ status: 'Verified', isDeleted: false });
    const revokedCount = await Certificate.countDocuments({ status: 'Revoked', isDeleted: false });
    const expiredCount = await Certificate.countDocuments({ status: 'Expired', isDeleted: false });
    
    // Today's generated
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayGenerated = await Certificate.countDocuments({ 
      isDeleted: false,
      createdAt: { $gte: startOfToday }
    });

    // Recent Verifications
    const recentVerifications = await VerificationLog.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent Certificates
    const recentCertificates = await Certificate.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('certificateId studentName status createdAt');

    // Most used colleges
    const topColleges = await Certificate.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$college', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 }
    ]);

    // Most used departments
    const topDepartments = await Certificate.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 }
    ]);

    res.json({
      success: true,
      data: {
        totalCertificates,
        verifiedCount,
        revokedCount,
        expiredCount,
        todayGenerated,
        recentVerifications,
        recentCertificates,
        topColleges,
        topDepartments
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };
