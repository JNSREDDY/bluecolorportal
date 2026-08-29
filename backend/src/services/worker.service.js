const { Op } = require('sequelize');
const {
  Worker, Skill, WorkerSkill, Certificate, EmploymentHistory, Rating, Application, Job, Company, SavedJob, Employer, Interview,
} = require('../models');
const { ApiError } = require('../utils/apiError');
const { notify } = require('./notification.service');

const completion = (w) => {
  const checks = [
    w.firstName, w.lastName, w.phone, w.photo, w.city, w.expectedSalary,
    w.education, w.yearsExperience, w.bio,
  ];
  const score = Math.round((checks.filter(Boolean).length / checks.length) * 100);
  return Math.min(100, score);
};

class WorkerService {
  async getProfile(userId) {
    const worker = await Worker.findOne({
      where: { userId },
      include: [
        { model: Skill, through: { attributes: ['proficiency'] } },
        Certificate,
        EmploymentHistory,
        Rating,
      ],
    });
    if (!worker) throw new ApiError(404, 'Worker profile not found');
    return worker;
  }

  async updateProfile(userId, body) {
    const worker = await Worker.findOne({ where: { userId } });
    if (!worker) throw new ApiError(404, 'Worker profile not found');
    const fields = [
      'firstName', 'lastName', 'phone', 'photo', 'dateOfBirth', 'gender', 'address',
      'city', 'state', 'pincode', 'expectedSalary', 'preferredLocations', 'availability',
      'languages', 'education', 'yearsExperience', 'bio',
    ];
    fields.forEach((f) => {
      if (body[f] !== undefined) worker[f] = body[f];
    });
    worker.profileCompletion = completion(worker);
    await worker.save();
    return worker;
  }

  async setSkills(userId, skillIds) {
    const worker = await Worker.findOne({ where: { userId } });
    if (!worker) throw new ApiError(404, 'Worker profile not found');
    await WorkerSkill.destroy({ where: { workerId: worker.id } });
    const rows = (skillIds || []).map((s) => ({
      workerId: worker.id,
      skillId: s.skillId || s,
      proficiency: s.proficiency || 'intermediate',
    }));
    if (rows.length) await WorkerSkill.bulkCreate(rows);
    return this.getProfile(userId);
  }

  async addCertificate(userId, data) {
    const worker = await Worker.findOne({ where: { userId } });
    const cert = await Certificate.create({ ...data, workerId: worker.id, verified: false });
    return cert;
  }

  async addHistory(userId, data) {
    const worker = await Worker.findOne({ where: { userId } });
    return EmploymentHistory.create({ ...data, workerId: worker.id });
  }

  async resume(userId) {
    const worker = await this.getProfile(userId);
    return {
      digitalId: worker.digitalId,
      name: `${worker.firstName} ${worker.lastName}`,
      city: worker.city,
      skills: worker.Skills?.map((s) => s.name),
      experience: worker.EmploymentHistories,
      certificates: worker.Certificates,
      trustScore: worker.trustScore,
      education: worker.education,
    };
  }

  async identity(userId) {
    const worker = await Worker.findOne({ where: { userId } });
    return {
      digitalId: worker.digitalId,
      qrCode: worker.qrCode,
      trustScore: worker.trustScore,
      isVerified: worker.isVerified,
      name: `${worker.firstName} ${worker.lastName}`,
      photo: worker.photo,
    };
  }

  async saveJob(userId, jobId) {
    const worker = await Worker.findOne({ where: { userId } });
    const [row] = await SavedJob.findOrCreate({ where: { workerId: worker.id, jobId } });
    return row;
  }

  async unsaveJob(userId, jobId) {
    const worker = await Worker.findOne({ where: { userId } });
    await SavedJob.destroy({ where: { workerId: worker.id, jobId } });
    return { message: 'Removed' };
  }

  async savedJobs(userId) {
    const worker = await Worker.findOne({ where: { userId } });
    return SavedJob.findAll({ where: { workerId: worker.id }, include: [{ model: Job, include: [Company] }] });
  }

  async apply(userId, jobId, coverNote) {
    const worker = await Worker.findOne({ where: { userId } });
    const job = await Job.findByPk(jobId);
    if (!job || job.status !== 'published') throw new ApiError(400, 'Job is not open');
    const existing = await Application.findOne({ where: { jobId, workerId: worker.id } });
    if (existing) throw new ApiError(409, 'Already applied');
    const app = await Application.create({
      jobId,
      workerId: worker.id,
      recruiterId: job.recruiterId || null,
      coverNote,
      status: 'applied',
    });
    
    // Notify employer owner
    const employer = await Employer.findOne({ where: { companyId: job.companyId, isOwner: true } });
    if (employer) {
      await notify({
        userId: employer.userId,
        title: 'New application',
        message: `${worker.firstName} applied for ${job.title}`,
        type: 'application',
        email: true,
      });
    }

    // Notify assigned recruiter if present
    if (job.recruiterId) {
      const Recruiter = require('../models').Recruiter;
      const rec = await Recruiter.findByPk(job.recruiterId);
      if (rec && rec.userId && rec.userId !== employer?.userId) {
        await notify({
          userId: rec.userId,
          title: 'New candidate application assigned',
          message: `${worker.firstName} applied for ${job.title}`,
          type: 'application',
          email: true,
        });
      }
    }

    return app;
  }

  async myApplications(userId) {
    const worker = await Worker.findOne({ where: { userId } });
    return Application.findAll({
      where: { workerId: worker.id },
      include: [{ model: Job, include: [Company] }],
      order: [['createdAt', 'DESC']],
    });
  }

  async searchWorkers(query) {
    const { q, city, skill, minExp, verified, page = 1, limit = 20 } = query;
    const where = {};
    if (q) where[Op.or] = [
      { firstName: { [Op.like]: `%${q}%` } },
      { lastName: { [Op.like]: `%${q}%` } },
      { digitalId: { [Op.like]: `%${q}%` } },
    ];
    if (city) where.city = city;
    if (minExp) where.yearsExperience = { [Op.gte]: Number(minExp) };
    if (verified === 'true') where.isVerified = true;
    const include = [{ model: Skill, through: { attributes: ['proficiency'] } }, Rating];
    if (skill) {
      include[0].where = { name: { [Op.like]: `%${skill}%` } };
    }
    return Worker.findAndCountAll({
      where,
      include,
      distinct: true,
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
    });
  }

  async dashboard(userId) {
    const worker = await Worker.findOne({ where: { userId } });
    const applications = await Application.count({ where: { workerId: worker.id } });
    const saved = await SavedJob.count({ where: { workerId: worker.id } });
    const interviews = await Interview.findAll({
      include: [{ model: Application, where: { workerId: worker.id }, include: [Job] }],
      where: { status: 'scheduled' },
      limit: 5,
      order: [['scheduledAt', 'ASC']],
    });
    return {
      worker,
      stats: { applications, saved, trustScore: worker.trustScore, profileCompletion: worker.profileCompletion },
      interviews,
    };
  }
}

module.exports = new WorkerService();
