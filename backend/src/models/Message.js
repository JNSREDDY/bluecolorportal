const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('Message', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  senderId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  receiverId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  applicationId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  body: { type: DataTypes.TEXT, allowNull: false },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'messages' });

module.exports = Message;
