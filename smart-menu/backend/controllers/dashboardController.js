const { Meal, Category, Feedback, Payment, sequelize } = require('../models');

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
      attributes: ['categoryId', [sequelize.fn('COUNT', sequelize.col('Meal.id')), 'count']],
      group: ['categoryId', 'Category.id'],
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
