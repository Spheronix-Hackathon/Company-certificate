const CompanySetting = require('../models/CompanySetting');

// @desc    Get company settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res, next) => {
  try {
    const settings = await CompanySetting.findOne();
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

// @desc    Update company settings
// @route   PUT /api/settings
// @access  Private (Super Admin)
const updateSettings = async (req, res, next) => {
  try {
    let settings = await CompanySetting.findOne();
    if (settings) {
      settings = await CompanySetting.findOneAndUpdate({}, req.body, { new: true });
    } else {
      settings = await CompanySetting.create(req.body);
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSettings, updateSettings };
