const { Sequelize } = require('sequelize');
const config = require('./config');

// Determine the environment (default to development)
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: 'postgres',
    logging: false, // Set to console.log to see SQL queries in logs
    pool: {
      max: 10,       
      min: 2,        
      acquire: 30000, 
      idle: 10000    
    },
    retry: {
      match: [
        /SequelizeConnectionError/, 
        /SequelizeConnectionRefusedError/,
        /SequelizeHostNotFoundError/,
        /SequelizeHostNotReachableError/,
        /SequelizeInvalidConnectionError/,
        /SequelizeConnectionTimedOutError/
      ],
      max: 5 
    }
  }
);

module.exports = sequelize;