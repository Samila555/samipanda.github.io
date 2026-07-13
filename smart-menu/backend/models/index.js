const { sequelize } = require('../config/db');
const User = require('./User');
const Category = require('./Category');
const Meal = require('./Meal');
const Feedback = require('./Feedback');
const Payment = require('./Payment');
const QRCodeModel = require('./QRCode');

module.exports = {
  sequelize,
  User,
  Category,
  Meal,
  Feedback,
  Payment,
  QRCodeModel
};
