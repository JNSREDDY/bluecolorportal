const { Application, Job, Worker, Recruiter, Company, Interview, Offer } = require('../models');

class ApplicationRepository {
    async create(data) {
        return Application.create(data);
    }

    async findById(id) {
        return Application.findByPk(id, {
            include: [
                { model: Job, include: [{ model: Company }] },
                { model: Worker },
                { model: Recruiter },
                { model: Interview },
                { model: Offer },
            ],
        });
    }

    async updateStatus(id, status) {
        return Application.update({ status }, { where: { id } });
    }

    async listByWorker(workerId) {
        return Application.findAll({
            where: { workerId },
            include: [
                { model: Job, include: [{ model: Company }] },
                { model: Interview },
                { model: Offer },
            ],
            order: [['createdAt', 'DESC']],
        });
    }

    async listByJob(jobId) {
        return Application.findAll({
            where: { jobId },
            include: [{ model: Worker }, { model: Interview }, { model: Offer }],
            order: [['createdAt', 'DESC']],
        });
    }
}

module.exports = new ApplicationRepository();
