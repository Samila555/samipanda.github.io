const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const QRCodeModel = sequelize.define('QRCode', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  qrImage: { type: DataTypes.TEXT('long'), allowNull: false },
  menuUrl: { type: DataTypes.STRING, allowNull: false },
  title: { type: DataTypes.STRING, defaultValue: 'Menu QR Code' },
}, { timestamps: true });

module.exports = QRCodeModel;
