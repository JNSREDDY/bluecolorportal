const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Job = sequelize.define('Job', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  companyId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  postedBy: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  recruiterId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  title: { type: DataTypes.STRING(190), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  salaryMin: { type: DataTypes.INTEGER, allowNull: true },
  salaryMax: { type: DataTypes.INTEGER, allowNull: true },
  experienceMin: { type: DataTypes.INTEGER, defaultValue: 0 },
  experienceMax: { type: DataTypes.INTEGER, defaultValue: 10 },
  vacancies: { type: DataTypes.INTEGER, defaultValue: 1 },
  location: { type: DataTypes.STRING(190), allowNull: true },
  city: { type: DataTypes.STRING(80), allowNull: true },
  state: { type: DataTypes.STRING(80), allowNull: true },
  jobType: { type: DataTypes.ENUM('full_time', 'contract', 'daily_wage', 'part_time'), defaultValue: 'full_time' },
  shift: { type: DataTypes.ENUM('day', 'night', 'rotational'), defaultValue: 'day' },
  accommodation: { type: DataTypes.BOOLEAN, defaultValue: false },
  food: { type: DataTypes.BOOLEAN, defaultValue: false },
  benefits: { type: DataTypes.TEXT, allowNull: true },
  deadline: { type: DataTypes.DATEONLY, allowNull: true },
  status: { type: DataTypes.ENUM('draft', 'published', 'paused', 'closed'), defaultValue: 'draft' },
}, { tableName: 'jobs' });

module.exports = Job;
