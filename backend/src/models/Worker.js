const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Worker = sequelize.define('Worker', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  firstName: { type: DataTypes.STRING(80), allowNull: false },
  lastName: { type: DataTypes.STRING(80), allowNull: false },
  phone: { type: DataTypes.STRING(20), allowNull: true },
  photo: { type: DataTypes.STRING(500), allowNull: true },
  dateOfBirth: { type: DataTypes.DATEONLY, allowNull: true },
  gender: { type: DataTypes.ENUM('male', 'female', 'other'), allowNull: true },
  address: { type: DataTypes.STRING(255), allowNull: true },
  city: { type: DataTypes.STRING(80), allowNull: true },
  state: { type: DataTypes.STRING(80), allowNull: true },
  pincode: { type: DataTypes.STRING(10), allowNull: true },
  expectedSalary: { type: DataTypes.INTEGER, allowNull: true },
  preferredLocations: { type: DataTypes.JSON, allowNull: true },
  availability: { type: DataTypes.ENUM('immediate', '15_days', '30_days', 'not_looking'), defaultValue: 'immediate' },
  languages: { type: DataTypes.JSON, allowNull: true },
  education: { type: DataTypes.STRING(190), allowNull: true },
  yearsExperience: { type: DataTypes.INTEGER, defaultValue: 0 },
  profileCompletion: { type: DataTypes.INTEGER, defaultValue: 20 },
  trustScore: { type: DataTypes.DECIMAL(4, 1), defaultValue: 50.0 },
  digitalId: { type: DataTypes.STRING(40), allowNull: true, unique: true },
  qrCode: { type: DataTypes.TEXT, allowNull: true },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  bio: { type: DataTypes.TEXT, allowNull: true },
}, { tableName: 'workers' });

module.exports = Worker;
