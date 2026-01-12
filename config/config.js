const path = require('path');
try { require('dotenv').config(); } catch (e) {}

// 1. Shared Database Settings
const dbSettings = {
  username: process.env.DB_USER || 'admin',
  password: process.env.DB_PASS || 'secret',
  database: process.env.DB_NAME || 'pdf_service',
  host: process.env.DB_HOST || 'db',
  dialect: 'postgres',
  logging: false
};

module.exports = {
  // 2. Application settings (Read by server.js)
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'your-default-secret',
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100
  },

  // 3. Environment settings (Read by Sequelize)
  development: {
    ...dbSettings
  },
  production: {
    ...dbSettings,
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000
    }
  }
};