import os

base_dir = r"c:\Users\HP\Desktop\Smart Manu\smart-menu\backend"

files = {
    "controllers/dashboardController.js": """const { Meal, Category, Feedback, Payment, sequelize } = require('../models');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalMeals = await Meal.count();
    const totalCategories = await Category.count();
    const totalFeedbacks = await Feedback.count();
    const totalPayments = await Payment.count();
    const pendingPayments = await Payment.count({ where: { paymentStatus: 'pending' } });
    const verifiedPayments = await Payment.count({ where: { paymentStatus: 'verified' } });
    
    let totalRevenue = await Payment.sum('amount', { where: { paymentStatus: 'verified' } }) || 0;
    
    const popularMeals = await Meal.findAll({ order: [['popularity', 'DESC']], limit: 5, include: [{ model: Category, as: 'Category', attributes: ['name'] }] });
    const recentFeedbacks = await Feedback.findAll({ order: [['createdAt', 'DESC']], limit: 5 });
    const recentPayments = await Payment.findAll({ order: [['createdAt', 'DESC']], limit: 5 });
    
    // categoryMealCounts
    const catCounts = await Meal.findAll({
      attributes: ['categoryId', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['categoryId'],
      order: [[sequelize.literal('count'), 'DESC']],
      limit: 5,
      include: [{ model: Category, as: 'Category', attributes: ['name'] }]
    });

    const categoryMealCounts = catCounts.map(c => ({
        _id: { _id: c.categoryId, name: c.Category ? c.Category.name : 'Unknown' },
        count: parseInt(c.get('count'), 10)
    }));

    res.json({
      totalMeals, totalCategories, totalFeedbacks, totalPayments,
      pendingPayments, verifiedPayments, totalRevenue,
      popularMeals: popularMeals.map(m => { let v = m.toJSON(); v._id = v.id; return v; }),
      recentFeedbacks: recentFeedbacks.map(f => { let v = f.toJSON(); v._id = v.id; return v; }),
      recentPayments: recentPayments.map(p => { let v = p.toJSON(); v._id = v.id; return v; }),
      categoryMealCounts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
""",

    "controllers/mealController.js": """const QRCode = require('qrcode');
const { Meal, Category } = require('../models');
const { Op } = require('sequelize');

exports.getMeals = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, available } = req.query;
    const where = {};
    if (category) where.categoryId = category;
    if (search) where.name = { [Op.like]: `%${search}%` };
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = Number(minPrice);
      if (maxPrice) where.price[Op.lte] = Number(maxPrice);
    }
    if (available !== undefined) where.available = available === 'true';
    
    const meals = await Meal.findAll({ where, include: [{ model: Category, as: 'Category', attributes: ['name'] }], order: [['createdAt', 'DESC']] });
    res.json(meals.map(m => { let v = m.toJSON(); v._id = v.id; return v; }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMeal = async (req, res) => {
  try {
    const meal = await Meal.findByPk(req.params.id, { include: [{ model: Category, as: 'Category', attributes: ['name'] }] });
    if (!meal) return res.status(404).json({ message: 'Meal not found' });
    
    await meal.increment('popularity');
    let v = meal.toJSON(); v._id = v.id;
    res.json(v);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createMeal = async (req, res) => {
  try {
    const { categoryId, name, description, ingredients, preparationMethod, calories, protein, carbohydrates, fat, price, available } = req.body;
    const category = await Category.findByPk(categoryId);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    
    const image = req.file ? `/uploads/${req.file.filename}` : '';
    const meal = await Meal.create({
      categoryId, name, image, description,
      ingredients: ingredients ? (typeof ingredients === 'string' ? ingredients.split(',').map(i => i.trim()) : ingredients) : [],
      preparationMethod, calories: Number(calories) || 0, protein: Number(protein) || 0,
      carbohydrates: Number(carbohydrates) || 0, fat: Number(fat) || 0,
      price: Number(price), available: available !== undefined ? available === 'true' || available === true : true,
    });
    
    const frontendUrl = process.env.FRONTEND_URL || `${req.protocol}://${req.get('host').replace(':5000', ':5173')}`;
    const mealUrl = `${frontendUrl}/menu?meal=${meal.id}`;
    
    try {
      const qrImage = await QRCode.toDataURL(mealUrl, { width: 600, margin: 2, color: { dark: '#000000', light: '#FFFFFF' } });
      meal.qrCode = qrImage;
      await meal.save();
    } catch (err) {}
    
    await meal.reload({ include: [{ model: Category, as: 'Category', attributes: ['name'] }] });
    let v = meal.toJSON(); v._id = v.id;
    res.status(201).json(v);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMeal = async (req, res) => {
  try {
    const updateData = {};
    const fields = ['categoryId', 'name', 'description', 'preparationMethod', 'calories', 'protein', 'carbohydrates', 'fat', 'price', 'available'];
    for (const field of fields) {
      if (req.body[field] !== undefined) {
        updateData[field] = field === 'calories' || field === 'protein' || field === 'carbohydrates' || field === 'fat' || field === 'price'
          ? Number(req.body[field]) : field === 'available' ? (req.body[field] === 'true' || req.body[field] === true) : req.body[field];
      }
    }
    if (req.body.ingredients) {
      updateData.ingredients = typeof req.body.ingredients === 'string' ? req.body.ingredients.split(',').map(i => i.trim()) : req.body.ingredients;
    }
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;
    
    const meal = await Meal.findByPk(req.params.id);
    if (!meal) return res.status(404).json({ message: 'Meal not found' });
    await meal.update(updateData);
    
    const frontendUrl = process.env.FRONTEND_URL || `${req.protocol}://${req.get('host').replace(':5000', ':5173')}`;
    const mealUrl = `${frontendUrl}/menu?meal=${meal.id}`;
    try {
      const qrImage = await QRCode.toDataURL(mealUrl, { width: 600, margin: 2, color: { dark: '#000000', light: '#FFFFFF' } });
      meal.qrCode = qrImage;
      await meal.save();
    } catch (err) {}
    
    await meal.reload({ include: [{ model: Category, as: 'Category', attributes: ['name'] }] });
    let v = meal.toJSON(); v._id = v.id;
    res.json(v);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMealQR = async (req, res) => {
  try {
    const meal = await Meal.findByPk(req.params.id);
    if (!meal) return res.status(404).json({ message: 'Meal not found' });
    if (meal.qrCode) return res.json({ qrCode: meal.qrCode, url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/menu?meal=${meal.id}` });
    
    const frontendUrl = process.env.FRONTEND_URL || `${req.protocol}://${req.get('host').replace(':5000', ':5173')}`;
    const mealUrl = `${frontendUrl}/menu?meal=${meal.id}`;
    const qrImage = await QRCode.toDataURL(mealUrl, { width: 600, margin: 2, color: { dark: '#000000', light: '#FFFFFF' } });
    meal.qrCode = qrImage;
    await meal.save();
    res.json({ qrCode: qrImage, url: mealUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findByPk(req.params.id);
    if (!meal) return res.status(404).json({ message: 'Meal not found' });
    await meal.destroy();
    res.json({ message: 'Meal deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
"""
}

for rel_path, content in files.items():
    full_path = os.path.join(base_dir, rel_path.replace("/", "\\"))
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Wrote {full_path}")
