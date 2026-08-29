const jwt = require('jsonwebtoken');
const env = require('../config/env');

const signAccess = (user) =>
  jwt.sign({ id: user.id, role: user.role }, env.jwt.secret, { expiresIn: env.jwt.expiresIn });

const signRefresh = (user) =>
  jwt.sign({ id: user.id, role: user.role }, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpiresIn });

const setRefreshCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: env.cookie.secure,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/auth/refresh',
  });
};

module.exports = { signAccess, signRefresh, setRefreshCookie };
