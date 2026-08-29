const { Op } = require('sequelize');
const { Job, Company, Skill, User } = require('../models');

class JobRepository {
    async create(data) {
        return Job.create(data);
    }

    async findById(id) {
        return Job.findByPk(id, {
            include: [
                { model: Company, attributes: ['id', 'name', 'city', 'state', 'verificationStatus'] },
                { model: Skill, through: { attributes: [] } },
                { model: User, as: 'Poster', attributes: ['id', 'email'] },
            ],
        });
    }

    async update(id, data) {
        return Job.update(data, { where: { id } });
    }

    async delete(id) {
        return Job.destroy({ where: { id } });
    }

    async list({ companyId, status, city, jobType, q, page = 1, limit = 10 }) {
        const where = {};
        if (companyId) where.companyId = companyId;
        if (status) where.status = status;
        if (city) where.city = city;
        if (jobType) where.jobType = jobType;
        if (q) {
            where[Op.or] = [
                { title: { [Op.like]: `%${q}%` } },
                { description: { [Op.like]: `%${q}%` } },
                { location: { [Op.like]: `%${q}%` } },
            ];
        }

        return Job.findAndCountAll({
            where,
            include: [
                { model: Company, attributes: ['id', 'name', 'city', 'state'] },
                { model: Skill, through: { attributes: [] } },
            ],
            limit: Number(limit),
            offset: (Number(page) - 1) * Number(limit),
            order: [['createdAt', 'DESC']],
        });
    }
}

module.exports = new JobRepository();
