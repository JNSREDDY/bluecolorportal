const { Op } = require('sequelize');
const { User } = require('../models');

class UserRepository {
  findByEmail(email) {
    if (!email) return null;
    const clean = String(email).trim();
    return User.findOne({
      where: {
        [Op.or]: [
          { email: clean },
          { email: clean.toLowerCase() },
        ],
      },
    });
  }

  findById(id) {
    return User.findByPk(id);
  }

  create(data) {
    return User.create(data);
  }

  update(id, data) {
    return User.update(data, { where: { id } });
  }

  list({ role, q, page = 1, limit = 20 }) {
    const where = {};
    if (role) where.role = role;
    if (q) where.email = { [Op.like]: `%${q}%` };
    return User.findAndCountAll({
      where,
      attributes: { exclude: ['password', 'refreshToken'] },
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
      order: [['createdAt', 'DESC']],
    });
  }
}

module.exports = new UserRepository();
