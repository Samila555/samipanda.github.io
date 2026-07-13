const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Payment = sequelize.define('Payment', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  customerName: { type: DataTypes.STRING, allowNull: false },
  screenshot: { type: DataTypes.STRING, allowNull: false },
  transactionId: { type: DataTypes.STRING, defaultValue: '' },
  amount: { type: DataTypes.FLOAT, defaultValue: 0 },
  paymentStatus: { type: DataTypes.ENUM('pending', 'verified', 'rejected'), defaultValue: 'pending' },
  note: { type: DataTypes.STRING, defaultValue: '' },
}, { timestamps: true });

module.exports = Payment;
