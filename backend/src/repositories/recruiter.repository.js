const { Recruiter, User, Company } = require('../models');

class RecruiterRepository {
    async findByUserId(userId) {
        return Recruiter.findOne({
            where: { userId },
            include: [
                { model: Company },
                { model: User, attributes: ['id', 'email', 'role'] },
            ],
        });
    }

    async findByCompany(companyId) {
        return Recruiter.findAll({
            where: { companyId },
            include: [{ model: User, attributes: ['id', 'email', 'role', 'isActive'] }],
        });
    }

    async updateStatus(id, status) {
        return Recruiter.update({ status }, { where: { id } });
    }
}

module.exports = new RecruiterRepository();
