const {
  Application, Job, Worker, Interview, Offer, Recruiter, Employer, Company, User, Skill,
} = require('../models');
const { ApiError } = require('../utils/apiError');
const { notify } = require('./notification.service');
const jobService = require('./job.service');

class ApplicationService {
  async companyContext(userId) {
    const emp = await Employer.findOne({ where: { userId } });
    const rec = await Recruiter.findOne({ where: { userId } });
    const companyId = emp?.companyId || rec?.companyId;
    if (!companyId) throw new ApiError(403, 'Company context required');
    return { companyId, recruiter: rec, employer: emp };
  }

  async list(userId, query) {
    const { companyId } = await this.companyContext(userId);
    const jobs = await Job.findAll({ where: { companyId }, attributes: ['id'] });
    const where = { jobId: jobs.map((j) => j.id) };
    if (query.status) where.status = query.status;
    if (query.jobId) where.jobId = query.jobId;
    if (query.recruiterId) where.recruiterId = query.recruiterId;
    return Application.findAll({
      where,
      include: [
        { model: Job, include: [{ model: Recruiter, attributes: ['id', 'fullName', 'designation'] }] },
        { model: Recruiter, attributes: ['id', 'fullName', 'designation', 'phone'] },
        { model: Worker, include: [{ model: Skill, through: { attributes: ['proficiency'] } }] },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async assignRecruiter(userId, id, recruiterIdOrEmail) {
    const app = await Application.findByPk(id, { include: [Job, Worker] });
    if (!app) throw new ApiError(404, 'Application not found');
    const { companyId } = await this.companyContext(userId);
    
    if (!recruiterIdOrEmail) {
      app.recruiterId = null;
      await app.save();
      return app;
    }
    
    let recruiterId = recruiterIdOrEmail;
    
    // Check if it's an email (contains @ symbol)
    if (typeof recruiterIdOrEmail === 'string' && recruiterIdOrEmail.includes('@')) {
      const recruiterUser = await User.findOne({ where: { email: recruiterIdOrEmail } });
      if (!recruiterUser) throw new ApiError(404, 'Recruiter email not found');
      const recruiter = await Recruiter.findOne({ where: { userId: recruiterUser.id, companyId } });
      if (!recruiter) throw new ApiError(400, 'Recruiter not part of your company');
      recruiterId = recruiter.id;
    } else {
      recruiterId = Number(recruiterIdOrEmail);
    }
    
    app.recruiterId = recruiterId;
    await app.save();
    return app;
  }

  async setStatus(userId, id, status) {
    const app = await Application.findByPk(id, { include: [Job, Worker] });
    if (!app) throw new ApiError(404, 'Application not found');
    await this.companyContext(userId);
    app.status = status;
    await app.save();
    await notify({
      userId: (await Worker.findByPk(app.workerId)).userId,
      title: 'Application update',
      message: `Your application for ${app.Job.title} is now ${status.replace('_', ' ')}`,
      type: 'application',
      email: true,
    });
    return app;
  }

  async scheduleInterview(userId, applicationId, data) {
    const app = await Application.findByPk(applicationId, { include: [Job, Worker] });
    if (!app) throw new ApiError(404, 'Application not found');
    const interview = await Interview.create({ applicationId, ...data, status: 'scheduled' });
    app.status = 'interview_scheduled';
    await app.save();
    await notify({
      userId: app.Worker.userId,
      title: 'Interview scheduled',
      message: `Interview for ${app.Job.title} on ${data.scheduledAt}`,
      type: 'interview',
      email: true,
    });
    return interview;
  }

  async completeInterview(userId, interviewId, notes) {
    const interview = await Interview.findByPk(interviewId, { include: [Application] });
    interview.status = 'completed';
    interview.notes = notes;
    await interview.save();
    interview.Application.status = 'interview_completed';
    await interview.Application.save();
    return interview;
  }

  async createOffer(userId, applicationId, data) {
    const app = await Application.findByPk(applicationId, { include: [Job, Worker] });
    if (!app) throw new ApiError(404, 'Application not found');
    const letter = this.generateLetter(app, data);
    const offer = await Offer.create({
      applicationId,
      salary: data.salary,
      joiningDate: data.joiningDate,
      terms: data.terms,
      letterUrl: letter,
      status: 'sent',
    });
    app.status = 'offer_sent';
    await app.save();
    await jobService.syncJobFillStatus(app.jobId);
    await notify({
      userId: app.Worker.userId,
      title: 'Offer letter',
      message: `You received an offer for ${app.Job.title}`,
      type: 'offer',
      email: true,
    });
    return offer;
  }

  generateLetter(app, data) {
    return `OFFER LETTER\n\nDear ${app.Worker.firstName} ${app.Worker.lastName},\n\nWe are pleased to offer you the position of ${app.Job.title} at a monthly salary of INR ${data.salary}. Joining date: ${data.joiningDate || 'TBD'}.\n\n${data.terms || ''}\n\nWorkForce Connect`;
  }

  async workerInterviews(userId) {
    const worker = await Worker.findOne({ where: { userId } });
    return Interview.findAll({
      include: [{ model: Application, where: { workerId: worker.id }, include: [{ model: Job, include: [Company] }] }],
      order: [['scheduledAt', 'DESC']],
    });
  }

  async workerOffers(userId) {
    const worker = await Worker.findOne({ where: { userId } });
    return Offer.findAll({
      include: [{ model: Application, where: { workerId: worker.id }, include: [Job] }],
    });
  }

  async respondOffer(userId, offerId, status) {
    const offer = await Offer.findByPk(offerId, { include: [{ model: Application, include: [Worker] }] });
    if (offer.Application.Worker.userId !== userId) throw new ApiError(403, 'Not your offer');
    offer.status = status;
    await offer.save();
    if (status === 'accepted') {
      offer.Application.status = 'joined';
      await offer.Application.save();
      await jobService.syncJobFillStatus(offer.Application.jobId);
    }
    return offer;
  }
}

module.exports = new ApplicationService();
