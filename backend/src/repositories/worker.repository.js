const { Op } = require('sequelize');
const { Worker, User, Skill, Certificate, EmploymentHistory, Rating } = require('../models');

class WorkerRepository {
    async findByUserId(userId) {
        return Worker.findOne({
            where: { userId },
            include: [
                { model: User, attributes: ['id', 'email', 'role'] },
                { model: Skill, through: { attributes: ['proficiency'] } },
                { model: Certificate },
                { model: EmploymentHistory },
                { model: Rating },
            ],
        });
    }

    async findByDigitalId(digitalId) {
        return Worker.findOne({
            where: { digitalId },
            include: [
                { model: User, attributes: ['id', 'email'] },
                { model: Skill, through: { attributes: ['proficiency'] } },
                { model: Certificate },
                { model: Rating },
            ],
        });
    }

    async update(id, data) {
        return Worker.update(data, { where: { id } });
    }

    async list({ city, trade, q, verified, page = 1, limit = 10 }) {
        const where = {};
        if (city) where.city = city;
        if (verified !== undefined) where.isVerified = verified === 'true' || verified === true;
        if (q) {
            where[Op.or] = [
                { firstName: { [Op.like]: `%${q}%` } },
                { lastName: { [Op.like]: `%${q}%` } },
                { bio: { [Op.like]: `%${q}%` } },
            ];
        }

        return Worker.findAndCountAll({
            where,
            include: [
                { model: User, attributes: ['id', 'email'] },
                { model: Skill, through: { attributes: ['proficiency'] } },
            ],
            limit: Number(limit),
            offset: (Number(page) - 1) * Number(limit),
            order: [['trustScore', 'DESC']],
        });
    }
}

module.exports = new WorkerRepository();
