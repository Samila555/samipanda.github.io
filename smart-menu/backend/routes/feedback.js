const express = require('express');
const router = express.Router();
const { createFeedback, getFeedbacks, deleteFeedback, respondToFeedback } = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', createFeedback);
router.get('/', getFeedbacks);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteFeedback);
router.put('/:id/respond', protect, authorize('admin', 'manager'), respondToFeedback);

module.exports = router;
