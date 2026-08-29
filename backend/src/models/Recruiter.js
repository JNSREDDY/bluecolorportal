const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Recruiter = sequelize.define('Recruiter', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  companyId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  invitedBy: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  designation: { type: DataTypes.STRING(120), defaultValue: 'Recruiter' },
  phone: { type: DataTypes.STRING(20), allowNull: true },
  fullName: { type: DataTypes.STRING(120), allowNull: true },
  status: { type: DataTypes.ENUM('invited', 'active', 'deactivated'), defaultValue: 'invited' },
}, { tableName: 'recruiters' });

module.exports = Recruiter;
