const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RecruiterNote = sequelize.define('RecruiterNote', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  recruiterId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  workerId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  applicationId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  note: { type: DataTypes.TEXT, allowNull: false },
}, { tableName: 'recruiter_notes' });

module.exports = RecruiterNote;
