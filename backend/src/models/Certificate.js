const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Certificate = sequelize.define('Certificate', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  workerId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  name: { type: DataTypes.STRING(190), allowNull: false },
  issuer: { type: DataTypes.STRING(190), allowNull: true },
  issuedAt: { type: DataTypes.DATEONLY, allowNull: true },
  fileUrl: { type: DataTypes.STRING(500), allowNull: true },
  verified: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'certificates' });

module.exports = Certificate;
