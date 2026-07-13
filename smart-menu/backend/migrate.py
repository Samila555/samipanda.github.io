import os

base_dir = r"c:\Users\HP\Desktop\Smart Manu\smart-menu\backend"

files = {
    "config/db.js": """const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(
  process.env.MYSQL_DB || 'smart_menu',
  process.env.MYSQL_USER || 'root',
  process.env.MYSQL_PASSWORD || '',
  {
    host: process.env.MYSQL_HOST || '127.0.0.1',
    dialect: 'mysql',
    logging: false,
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Connected');
  } catch (error) {
    console.error('MySQL connection error:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
""",

    "models/Category.js": """const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Category = sequelize.define('Category', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: { type: DataTypes.STRING, defaultValue: '' },
  image: { type: DataTypes.STRING, defaultValue: '' },
}, { timestamps: true });

module.exports = Category;
""",

    "models/Feedback.js": """const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Feedback = sequelize.define('Feedback', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  customerName: { type: DataTypes.STRING, allowNull: false },
  rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
  comment: { type: DataTypes.STRING, defaultValue: '' },
  response: { type: DataTypes.STRING, defaultValue: '' },
}, { timestamps: true });

module.exports = Feedback;
""",

    "models/Payment.js": """const { DataTypes } = require('sequelize');
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
""",

    "models/QRCode.js": """const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const QRCodeModel = sequelize.define('QRCode', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  qrImage: { type: DataTypes.TEXT('long'), allowNull: false },
  menuUrl: { type: DataTypes.STRING, allowNull: false },
  title: { type: DataTypes.STRING, defaultValue: 'Menu QR Code' },
}, { timestamps: true });

module.exports = QRCodeModel;
""",

    "models/User.js": """const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'manager', 'cashier'), defaultValue: 'manager' },
}, { 
  timestamps: true,
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

User.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;
""",

    "models/Meal.js": """const { DataTypes } = require('sequelize');
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
    defaultValue: [],
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
  qrCode: { type: DataTypes.TEXT('long'), defaultValue: '' },
}, { timestamps: true });

Category.hasMany(Meal, { foreignKey: 'categoryId' });
Meal.belongsTo(Category, { foreignKey: 'categoryId', as: 'Category' });

module.exports = Meal;
""",

    "models/index.js": """const { sequelize } = require('../config/db');
const User = require('./User');
const Category = require('./Category');
const Meal = require('./Meal');
const Feedback = require('./Feedback');
const Payment = require('./Payment');
const QRCodeModel = require('./QRCode');

// Setup associations
Category.hasMany(Meal, { foreignKey: 'categoryId' });
Meal.belongsTo(Category, { foreignKey: 'categoryId', as: 'Category' });

module.exports = {
  sequelize,
  User,
  Category,
  Meal,
  Feedback,
  Payment,
  QRCodeModel
};
"""
}

for rel_path, content in files.items():
    full_path = os.path.join(base_dir, rel_path.replace("/", "\\"))
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Wrote {full_path}")
