const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Interview = sequelize.define('Interview', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  applicationId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  scheduledAt: { type: DataTypes.DATE, allowNull: false },
  mode: { type: DataTypes.ENUM('in_person', 'phone', 'video'), defaultValue: 'in_person' },
  location: { type: DataTypes.STRING(255), allowNull: true },
  status: { type: DataTypes.ENUM('scheduled', 'completed', 'cancelled', 'no_show'), defaultValue: 'scheduled' },
  notes: { type: DataTypes.TEXT, allowNull: true },
}, { tableName: 'interviews' });

module.exports = Interview;
