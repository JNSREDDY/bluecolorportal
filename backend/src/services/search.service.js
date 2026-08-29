const { Company, Job, Worker, Skill } = require('../models');
const { Op } = require('sequelize');

class SearchService {
  jobs(query) {
    return require('./job.service').publicSearch(query);
  }

  workers(query) {
    return require('./worker.service').searchWorkers(query);
  }

  async companies(query) {
    const { q, city, industry, verified, page = 1, limit = 12 } = query;
    const where = {};
    if (q) where.name = { [Op.like]: `%${q}%` };
    if (city) where.city = { [Op.like]: `%${city}%` };
    if (industry) where.industry = { [Op.like]: `%${industry}%` };
    if (verified === 'true') where.verificationStatus = 'approved';
    return Company.findAndCountAll({
      where,
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
    });
  }

  async skills(q) {
    const where = q ? { name: { [Op.like]: `%${q}%` } } : {};
    return Skill.findAll({ where, limit: 50 });
  }
}

module.exports = new SearchService();
