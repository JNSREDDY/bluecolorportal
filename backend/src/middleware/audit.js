const { AuditLog } = require('../models');

const audit = (action, entity) => async (req, res, next) => {
  res.on('finish', () => {
    if (res.statusCode < 400) {
      AuditLog.create({
        userId: req.user?.id,
        action,
        entity,
        entityId: req.params.id ? Number(req.params.id) : null,
        metadata: { method: req.method, path: req.originalUrl },
        ip: req.ip,
      }).catch(() => {});
    }
  });
  next();
};

module.exports = { audit };
