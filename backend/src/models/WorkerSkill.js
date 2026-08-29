const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WorkerSkill = sequelize.define('WorkerSkill', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  workerId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  skillId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  proficiency: { type: DataTypes.ENUM('beginner', 'intermediate', 'expert'), defaultValue: 'intermediate' },
}, { tableName: 'worker_skills' });

module.exports = WorkerSkill;
