const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rating = sequelize.define('Rating', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  workerId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  companyId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  rating: { type: DataTypes.DECIMAL(2, 1), allowNull: false },
  comment: { type: DataTypes.TEXT, allowNull: true },
  type: { type: DataTypes.ENUM('employer_to_worker', 'worker_to_company'), defaultValue: 'employer_to_worker' },
}, { tableName: 'ratings' });

module.exports = Rating;
