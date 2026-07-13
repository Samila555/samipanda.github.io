const express = require('express');
const router = express.Router();
const { createPayment, getPayments, updatePaymentStatus } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', upload.single('screenshot'), createPayment);
router.get('/', protect, authorize('admin', 'manager', 'cashier'), getPayments);
router.put('/:id', protect, authorize('admin', 'manager', 'cashier'), updatePaymentStatus);

module.exports = router;
