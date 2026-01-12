const path = require('path');
try { require('dotenv').config(); } catch (e) {}

// 1. Shared Database Settings
// We prioritize the DATABASE_URL string used in Docker
const dbSettings = {
  // If DATABASE_URL exists, Sequelize can use it directly. 
  // Otherwise, we use these individual parts.
  url: process.env.DATABASE_URL, 
  username: process.env.DB_USER || 'user',      // Changed 'admin' to 'user'
  password: process.env.DB_PASS || 'password',   // Changed 'secret' to 'password'
  database: process.env.DB_NAME || 'pdfdb',      // Changed to match your Compose file
  host: process.env.DB_HOST || 'db',
  dialect: 'postgres',
  logging: false
};

module.exports = {
  // 2. Application settings
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-key-123',
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
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