const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

// Support full MYSQL_URL or individual env vars (for Render + Railway)
const sequelize = process.env.MYSQL_URL
  ? new Sequelize(process.env.MYSQL_URL, {
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      connectTimeout: 30000,
      ssl: false,
    },
  })
  : new Sequelize(
    process.env.MYSQL_DB || 'smart_menu',
    process.env.MYSQL_USER || 'root',
    process.env.MYSQL_PASSWORD || '',
    {
      host: process.env.MYSQL_HOST || '127.0.0.1',
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      dialect: 'mysql',
      logging: false,
      dialectOptions: { connectTimeout: 30000 },
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
