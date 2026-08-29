const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AuditLog = sequelize.define('AuditLog', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  action: { type: DataTypes.STRING(120), allowNull: false },
  entity: { type: DataTypes.STRING(80), allowNull: true },
  entityId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  metadata: { type: DataTypes.JSON, allowNull: true },
  ip: { type: DataTypes.STRING(60), allowNull: true },
}, { tableName: 'audit_logs' });

module.exports = AuditLog;
