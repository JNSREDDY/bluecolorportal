const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Application = sequelize.define('Application', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  jobId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  workerId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  recruiterId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  status: {
    type: DataTypes.ENUM(
      'applied',
      'shortlisted',
      'interview_scheduled',
      'interview_completed',
      'selected',
      'rejected',
      'offer_sent',
      'joined'
    ),
    defaultValue: 'applied',
  },
  coverNote: { type: DataTypes.TEXT, allowNull: true },
}, { tableName: 'applications' });

module.exports = Application;
