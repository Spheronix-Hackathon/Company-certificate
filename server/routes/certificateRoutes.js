const express = require('express');
const router = express.Router();
const {
  addCertificate,
  getCertificates,
  getCertificateById,
  revokeCertificate,
  deleteCertificate
} = require('../controllers/certificateController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .post(authorize('Super Admin', 'HR Admin'), addCertificate)
  .get(getCertificates);

router.route('/:id')
  .get(getCertificateById)
  .delete(authorize('Super Admin', 'HR Admin'), deleteCertificate);

router.post('/:id/revoke', authorize('Super Admin', 'HR Admin'), revokeCertificate);

module.exports = router;
