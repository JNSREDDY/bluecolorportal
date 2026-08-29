const { Op } = require('sequelize');
const sequelize = require('../config/database');
const {
  User, Company, Worker, Job, Application, Certificate, VerificationRequest,
  Complaint, AuditLog, PlatformSetting, Employer,
} = require('../models');
const { ApiError } = require('../utils/apiError');
const { notify } = require('./notification.service');

class AdminService {
  async dashboard() {
    const [users, companies, workers, jobs, pendingEmployers, pendingWorkers] = await Promise.all([
      User.count(),
      Company.count(),
      Worker.count(),
      Job.count(),
      Company.count({ where: { verificationStatus: 'pending' } }),
      Worker.count({ where: { isVerified: false } }),
    ]);
    const apps = await Application.findAll({
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['status'],
      raw: true,
    });
    const byIndustry = await Company.findAll({
      attributes: ['industry', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['industry'],
      raw: true,
    });
    return {
      stats: { users, companies, workers, jobs, pendingEmployers, pendingWorkers, revenue: 0 },
      applications: apps,
      industries: byIndustry,
    };
  }

  async companies(status) {
    const where = status ? { verificationStatus: status } : {};
    return Company.findAll({ where, include: [{ model: Employer, include: [User] }], order: [['createdAt', 'DESC']] });
  }

  async setCompanyStatus(adminId, id, verificationStatus, notes) {
    const company = await Company.findByPk(id);
    if (!company) throw new ApiError(404, 'Company not found');
    company.verificationStatus = verificationStatus;
    await company.save();
    await VerificationRequest.update(
      { status: verificationStatus === 'approved' ? 'approved' : 'rejected', reviewedBy: adminId, notes },
      { where: { type: 'employer', entityId: id } }
    );
    const emp = await Employer.findOne({ where: { companyId: id, isOwner: true } });
    if (emp) {
      await notify({
        userId: emp.userId,
        title: 'Company verification',
        message: `Your company is ${verificationStatus}`,
        type: 'verification',
        email: true,
      });
    }
    return company;
  }

  async verifyWorker(adminId, workerId, approved) {
    const worker = await Worker.findByPk(workerId);
    if (!worker) throw new ApiError(404, 'Worker not found');
    worker.isVerified = approved;
    if (approved) worker.trustScore = Math.min(99, Number(worker.trustScore) + 8);
    await worker.save();
    await VerificationRequest.update(
      { status: approved ? 'approved' : 'rejected', reviewedBy: adminId },
      { where: { type: 'worker', userId: worker.userId } }
    );
    await notify({
      userId: worker.userId,
      title: 'Identity verification',
      message: approved ? 'Your digital identity is verified' : 'Verification was not approved',
      type: 'verification',
      email: true,
    });
    return worker;
  }

  async verifyCertificate(certId, verified) {
    const cert = await Certificate.findByPk(certId);
    if (!cert) throw new ApiError(404, 'Certificate not found');
    cert.verified = verified;
    await cert.save();
    return cert;
  }

  async users(query) {
    return require('../repositories/user.repository').list(query);
  }

  async setUserActive(id, isActive) {
    const user = await User.findByPk(id);
    if (!user) throw new ApiError(404, 'User not found');
    if (user.role === 'admin') throw new ApiError(400, 'Cannot change admin');
    user.isActive = isActive;
    await user.save();
    return user;
  }

  async jobs(query) {
    const where = {};
    if (query.status) where.status = query.status;
    if (query.q) where.title = { [Op.like]: `%${query.q}%` };
    return Job.findAll({ where, include: [Company], order: [['createdAt', 'DESC']], limit: 100 });
  }

  async closeJob(id) {
    const job = await Job.findByPk(id);
    job.status = 'closed';
    await job.save();
    return job;
  }

  async complaints() {
    return Complaint.findAll({ order: [['createdAt', 'DESC']] });
  }

  async resolveComplaint(id, status, resolution) {
    const c = await Complaint.findByPk(id);
    if (!c) throw new ApiError(404, 'Complaint not found');
    c.status = status;
    c.resolution = resolution;
    await c.save();
    return c;
  }

  async auditLogs(page = 1) {
    return AuditLog.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit: 50,
      offset: (page - 1) * 50,
    });
  }

  async settings() {
    return PlatformSetting.findAll();
  }

  async upsertSetting(key, value) {
    const [row] = await PlatformSetting.findOrCreate({ where: { key }, defaults: { value } });
    row.value = value;
    await row.save();
    return row;
  }

  async fraudSignals() {
    const duplicatePhones = await Worker.findAll({
      attributes: ['phone', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      where: { phone: { [Op.ne]: null } },
      group: ['phone'],
      having: sequelize.literal('COUNT(id) > 1'),
      raw: true,
    });
    const spamJobs = await Job.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: '%click here%' } },
          { description: { [Op.like]: '%whatsapp only money%' } },
        ],
      },
    });
    return { duplicatePhones, spamJobs };
  }

  async pendingCertificates() {
    return Certificate.findAll({ where: { verified: false }, include: [Worker], limit: 100 });
  }

  async pendingWorkers() {
    return Worker.findAll({ where: { isVerified: false }, include: [{ model: User, attributes: ['email'] }] });
  }
}

module.exports = new AdminService();
