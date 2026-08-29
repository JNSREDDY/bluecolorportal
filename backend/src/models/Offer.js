const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Offer = sequelize.define('Offer', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  applicationId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  salary: { type: DataTypes.INTEGER, allowNull: false },
  joiningDate: { type: DataTypes.DATEONLY, allowNull: true },
  letterUrl: { type: DataTypes.TEXT, allowNull: true },
  status: { type: DataTypes.ENUM('sent', 'accepted', 'declined', 'expired'), defaultValue: 'sent' },
  terms: { type: DataTypes.TEXT, allowNull: true },
}, { tableName: 'offers' });

module.exports = Offer;
