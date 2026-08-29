const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Employer = sequelize.define('Employer', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  companyId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  designation: { type: DataTypes.STRING(120), defaultValue: 'Owner' },
  isOwner: { type: DataTypes.BOOLEAN, defaultValue: true },
  phone: { type: DataTypes.STRING(20), allowNull: true },
  fullName: { type: DataTypes.STRING(120), allowNull: true },
}, { tableName: 'employers' });

module.exports = Employer;
