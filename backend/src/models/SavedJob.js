const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SavedJob = sequelize.define('SavedJob', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  workerId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  jobId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
}, { tableName: 'saved_jobs' });

module.exports = SavedJob;
