const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EmploymentHistory = sequelize.define('EmploymentHistory', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  workerId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  companyName: { type: DataTypes.STRING(190), allowNull: false },
  role: { type: DataTypes.STRING(120), allowNull: false },
  startDate: { type: DataTypes.DATEONLY, allowNull: true },
  endDate: { type: DataTypes.DATEONLY, allowNull: true },
  currentlyWorking: { type: DataTypes.BOOLEAN, defaultValue: false },
  description: { type: DataTypes.TEXT, allowNull: true },
}, { tableName: 'employment_history' });

module.exports = EmploymentHistory;
