const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING(190), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
  role: {
    type: DataTypes.ENUM('admin', 'employer', 'recruiter', 'worker'),
    allowNull: false,
  },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  isEmailVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  refreshToken: { type: DataTypes.TEXT, allowNull: true },
  lastLoginAt: { type: DataTypes.DATE, allowNull: true },
}, { tableName: 'users' });

module.exports = User;
