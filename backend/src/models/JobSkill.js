const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const JobSkill = sequelize.define('JobSkill', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  jobId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  skillId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
}, { tableName: 'job_skills' });

module.exports = JobSkill;
