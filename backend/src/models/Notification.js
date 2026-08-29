const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  title: { type: DataTypes.STRING(190), allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  type: { type: DataTypes.STRING(60), defaultValue: 'info' },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  metadata: { type: DataTypes.JSON, allowNull: true },
}, { tableName: 'notifications' });

module.exports = Notification;
