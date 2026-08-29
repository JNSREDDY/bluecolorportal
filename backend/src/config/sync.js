require('dotenv').config();
const { sequelize } = require('../models');
const logger = require('./utils/logger');

sequelize.sync({ alter: true }).then(() => {
  logger.info('Schema synced');
  process.exit(0);
}).catch((e) => {
  logger.error(e);
  process.exit(1);
});
