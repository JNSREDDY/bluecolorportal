const { Employer, Company, User, Recruiter, Job } = require('../models');

class EmployerRepository {
    async findByUserId(userId) {
        return Employer.findOne({
            where: { userId },
            include: [
                { model: Company, include: [{ model: Recruiter }, { model: Job }] },
                { model: User, attributes: ['id', 'email'] },
            ],
        });
    }

    async findCompanyById(companyId) {
        return Company.findByPk(companyId, {
            include: [{ model: Recruiter }, { model: Job }],
        });
    }

    async updateCompany(companyId, data) {
        return Company.update(data, { where: { id: companyId } });
    }
}

module.exports = new EmployerRepository();
