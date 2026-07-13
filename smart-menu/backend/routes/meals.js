const express = require('express');
const router = express.Router();
const { getMeals, getMeal, getMealQR, createMeal, updateMeal, deleteMeal } = require('../controllers/mealController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getMeals);
router.get('/:id', getMeal);
router.get('/:id/qrcode', getMealQR);
router.post('/', protect, authorize('admin', 'manager'), upload.single('image'), createMeal);
router.put('/:id', protect, authorize('admin', 'manager'), upload.single('image'), updateMeal);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteMeal);

module.exports = router;
