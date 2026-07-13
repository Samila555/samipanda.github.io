const express = require('express');
const router = express.Router();
const { generateQR, getQRCodes, deleteQR } = require('../controllers/qrController');
const { protect, authorize } = require('../middleware/auth');

router.post('/generate', protect, authorize('admin', 'manager'), generateQR);
router.get('/', protect, authorize('admin', 'manager'), getQRCodes);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteQR);

module.exports = router;
