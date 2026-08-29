const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CompanyDocument = sequelize.define('CompanyDocument', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  companyId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  type: { type: DataTypes.ENUM('gst', 'pan', 'other'), defaultValue: 'other' },
  fileUrl: { type: DataTypes.STRING(500), allowNull: true },
  verified: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'company_documents' });

module.exports = CompanyDocument;
