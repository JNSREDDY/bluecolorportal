const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Company = sequelize.define('Company', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(190), allowNull: false },
  gst: { type: DataTypes.STRING(20), allowNull: true },
  pan: { type: DataTypes.STRING(20), allowNull: true },
  address: { type: DataTypes.STRING(255), allowNull: true },
  city: { type: DataTypes.STRING(80), allowNull: true },
  state: { type: DataTypes.STRING(80), allowNull: true },
  pincode: { type: DataTypes.STRING(10), allowNull: true },
  industry: { type: DataTypes.STRING(120), allowNull: true },
  logo: { type: DataTypes.STRING(500), allowNull: true },
  website: { type: DataTypes.STRING(255), allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  employeeCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  verificationStatus: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'suspended'),
    defaultValue: 'pending',
  },
}, { tableName: 'companies' });

module.exports = Company;
