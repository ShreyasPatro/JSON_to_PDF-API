const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Template = sequelize.define('Template', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  html: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  css: {
    type: DataTypes.TEXT,
    defaultValue: '',
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  }
}, {
  tableName: 'Templates',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = Template;