const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getSettings);
router.put('/', protect, authorize('Super Admin'), updateSettings);

module.exports = router;
