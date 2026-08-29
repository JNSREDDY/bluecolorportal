const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PlatformSetting = sequelize.define('PlatformSetting', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  key: { type: DataTypes.STRING(80), unique: true, allowNull: false },
  value: { type: DataTypes.TEXT, allowNull: true },
}, { tableName: 'platform_settings' });

module.exports = PlatformSetting;
