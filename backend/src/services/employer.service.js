const {
  Company, Employer, Recruiter, Job, Application, Worker, User, JobSkill, CompanyDocument,
} = require('../models');
const { ApiError } = require('../utils/apiError');
const authService = require('./auth.service');

class EmployerService {
  async companyOf(userId) {
    const employer = await Employer.findOne({ where: { userId }, include: [Company] });
    if (!employer) throw new ApiError(404, 'Employer profile not found');
    return employer;
  }

  async updateCompany(userId, body) {
    const employer = await this.companyOf(userId);
    if (!employer.isOwner) throw new ApiError(403, 'Only the company owner can update company profile');
    const c = employer.Company;
    const fields = ['name', 'gst', 'pan', 'address', 'city', 'state', 'pincode', 'industry', 'logo', 'website', 'description', 'employeeCount'];
    fields.forEach((f) => {
      if (body[f] !== undefined) c[f] = body[f];
    });
    await c.save();
    return c;
  }

  async addDocument(userId, data) {
    const employer = await this.companyOf(userId);
    return CompanyDocument.create({ companyId: employer.companyId, ...data });
  }

  async inviteRecruiter(userId, body) {
    const employer = await this.companyOf(userId);
    if (!employer.isOwner) throw new ApiError(403, 'Only owner can invite recruiters');
    return authService.inviteRecruiter({
      ...body,
      companyId: employer.companyId,
      invitedBy: userId,
    });
  }

  async recruiters(userId) {
    const employer = await this.companyOf(userId);
    return Recruiter.findAll({
      where: { companyId: employer.companyId },
      include: [{ model: User, attributes: ['id', 'email', 'isActive', 'lastLoginAt'] }],
    });
  }

  async setRecruiterStatus(userId, recruiterId, status) {
    const employer = await this.companyOf(userId);
    const rec = await Recruiter.findOne({ where: { id: recruiterId, companyId: employer.companyId } });
    if (!rec) throw new ApiError(404, 'Recruiter not found');
    rec.status = status;
    await rec.save();
    if (status === 'deactivated') {
      const user = await User.findByPk(rec.userId);
      user.isActive = false;
      await user.save();
    }
    if (status === 'active') {
      const user = await User.findByPk(rec.userId);
      user.isActive = true;
      await user.save();
    }
    return rec;
  }

  async dashboard(userId) {
    const employer = await this.companyOf(userId);
    const companyId = employer.companyId;
    const openJobs = await Job.count({ where: { companyId, status: 'published' } });
    const jobs = await Job.findAll({ where: { companyId }, attributes: ['id'] });
    const jobIds = jobs.map((j) => j.id);
    const applications = jobIds.length
      ? await Application.count({ where: { jobId: jobIds } })
      : 0;
    const recruiters = await Recruiter.count({ where: { companyId } });
    const joined = jobIds.length
      ? await Application.count({ where: { jobId: jobIds, status: 'joined' } })
      : 0;
    const pipeline = await Application.findAll({
      where: jobIds.length ? { jobId: jobIds } : { id: 0 },
      attributes: ['status', [require('../config/database').fn('COUNT', require('../config/database').col('id')), 'count']],
      group: ['status'],
      raw: true,
    });
    return {
      company: employer.Company,
      stats: { openJobs, applications, recruiters, employees: joined },
      pipeline,
    };
  }
}

module.exports = new EmployerService();
