const express = require('express');
const router = express.Router();
const { verifyCertificate } = require('../controllers/verifyController');

router.get('/:certificateId', verifyCertificate);

module.exports = router;
