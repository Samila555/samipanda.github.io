const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Category = require('./Category');

const Meal = sequelize.define('Meal', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  categoryId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Category, key: 'id' } },
  name: { type: DataTypes.STRING, allowNull: false },
  image: { type: DataTypes.STRING, defaultValue: '' },
  description: { type: DataTypes.STRING, defaultValue: '' },
  ingredients: {
    type: DataTypes.JSON,
    get() {
      const rawValue = this.getDataValue('ingredients');
      return rawValue ? (typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue) : [];
    }
  },
  preparationMethod: { type: DataTypes.STRING, defaultValue: '' },
  calories: { type: DataTypes.INTEGER, defaultValue: 0 },
  protein: { type: DataTypes.FLOAT, defaultValue: 0 },
  carbohydrates: { type: DataTypes.FLOAT, defaultValue: 0 },
  fat: { type: DataTypes.FLOAT, defaultValue: 0 },
  price: { type: DataTypes.FLOAT, allowNull: false },
  available: { type: DataTypes.BOOLEAN, defaultValue: true },
  popularity: { type: DataTypes.INTEGER, defaultValue: 0 },
  qrCode: { type: DataTypes.TEXT('long'), allowNull: true },
}, { timestamps: true });

Category.hasMany(Meal, { foreignKey: 'categoryId' });
Meal.belongsTo(Category, { foreignKey: 'categoryId', as: 'Category' });

module.exports = Meal;
