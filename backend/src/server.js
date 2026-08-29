const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');
const env = require('./config/env');
const { sequelize } = require('./models');
const routes = require('./routes');
const { errorHandler, notFound } = require('./utils/apiError');
const logger = require('./utils/logger');
const { registerSockets } = require('./sockets');

const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: env.clientUrl, credentials: true },
});
registerSockets(io);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(env.env === 'production' ? 'combined' : 'dev'));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 80 }));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 600 }));
app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

const start = async () => {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  logger.info('MySQL connected & models synced');
  server.listen(env.port, () => logger.info(`API listening on :${env.port}`));
};

start().catch((err) => {
  logger.error(err);
  process.exit(1);
});

module.exports = { app, server };
