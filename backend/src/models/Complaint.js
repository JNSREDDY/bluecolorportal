const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Complaint = sequelize.define('Complaint', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  raisedBy: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  againstUserId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  type: { type: DataTypes.STRING(80), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.ENUM('open', 'investigating', 'resolved', 'dismissed'), defaultValue: 'open' },
  resolution: { type: DataTypes.TEXT, allowNull: true },
}, { tableName: 'complaints' });

module.exports = Complaint;
