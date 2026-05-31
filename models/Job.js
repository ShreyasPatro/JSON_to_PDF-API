const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.STRING, // String to support BullMQ/Redis ID formats
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID, 
    allowNull: false
  },
  templateId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'pending'
  },
  type: {
    type: DataTypes.STRING, // e.g., 'sync', 'async', 'raw'
    allowNull: false
  },
  downloadUrl: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'Jobs'
});

module.exports = Job;