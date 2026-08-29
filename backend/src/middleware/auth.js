const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { User } = require('../models');
const { ApiError } = require('../utils/apiError');

const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : req.cookies?.accessToken;
    if (!token) throw new ApiError(401, 'Authentication required');
    const decoded = jwt.verify(token, env.jwt.secret);
    const user = await User.findByPk(decoded.id);
    if (!user || !user.isActive) throw new ApiError(401, 'Invalid or inactive account');
    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch (err) {
    next(err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError'
      ? new ApiError(401, 'Invalid or expired token')
      : err);
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError(403, 'You do not have permission for this action'));
  }
  next();
};

module.exports = { authenticate, authorize };
