const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { setIo } = require('./io');
const logger = require('../utils/logger');

const registerSockets = (io) => {
  setIo(io);
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) return next(new Error('Unauthorized'));
      const decoded = jwt.verify(token, env.jwt.secret);
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    socket.join(`user:${socket.userId}`);
    logger.debug(`socket connected user=${socket.userId}`);
    socket.on('chat:send', (payload) => {
      io.to(`user:${payload.receiverId}`).emit('chat:message', {
        ...payload,
        senderId: socket.userId,
        at: new Date().toISOString(),
      });
    });
  });
};

module.exports = { registerSockets };
