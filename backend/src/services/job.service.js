const { Op } = require('sequelize');
const { Job, Company, Skill, JobSkill, Application, Recruiter } = require('../models');
const { ApiError } = require('../utils/apiError');
const employerService = require('./employer.service');

const normalizeVacancyCount = (value, fallback = 1) => {
  const parsed = Number(value ?? fallback);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(1, Math.floor(parsed));
};

class JobService {
  async create(userId, body) {
    const employer = await employerService.companyOf(userId).catch(async () => {
      const rec = await Recruiter.findOne({ where: { userId } });
      if (!rec) throw new ApiError(403, 'Not authorized to post jobs');
      return rec;
    });
    
    let recruiterId = null;
    // If recruiter email is provided, look up the recruiter
    if (body.recruiterEmail) {
      const recruiterUser = await require('../models').User.findOne({ where: { email: body.recruiterEmail } });
      if (!recruiterUser) throw new ApiError(404, 'Recruiter email not found');
      const recruiter = await Recruiter.findOne({ where: { userId: recruiterUser.id, companyId: employer.companyId } });
      if (!recruiter) throw new ApiError(400, 'Recruiter not part of your company');
      recruiterId = recruiter.id;
    } else if (body.recruiterId) {
      // Fallback to ID if provided
      recruiterId = Number(body.recruiterId);
    }
    
    const job = await Job.create({
      ...body,
      vacancies: normalizeVacancyCount(body.vacancies, 1),
      companyId: employer.companyId,
      postedBy: userId,
      recruiterId,
      status: body.status || 'draft',
    });
    if (body.skillIds?.length) {
      await JobSkill.bulkCreate(body.skillIds.map((skillId) => ({ jobId: job.id, skillId })));
    }
    return job;
  }

  async update(userId, id, body) {
    const job = await this.assertCompanyJob(userId, id);
    const fields = [
      'title', 'description', 'salaryMin', 'salaryMax', 'experienceMin', 'experienceMax',
      'vacancies', 'location', 'city', 'state', 'jobType', 'shift', 'accommodation',
      'food', 'benefits', 'deadline', 'status',
    ];
    fields.forEach((f) => {
      if (body[f] !== undefined) {
        if (f === 'vacancies') {
          job[f] = normalizeVacancyCount(body[f], 1);
        } else {
          job[f] = body[f] ? Number(body[f]) : null;
        }
      }
    });
    
    // Handle recruiter email or ID update
    if (body.recruiterEmail) {
      const recruiterUser = await require('../models').User.findOne({ where: { email: body.recruiterEmail } });
      if (!recruiterUser) throw new ApiError(404, 'Recruiter email not found');
      const employer = await employerService.companyOf(userId);
      const recruiter = await Recruiter.findOne({ where: { userId: recruiterUser.id, companyId: employer.companyId } });
      if (!recruiter) throw new ApiError(400, 'Recruiter not part of your company');
      job.recruiterId = recruiter.id;
    } else if (body.recruiterId !== undefined) {
      job.recruiterId = body.recruiterId ? Number(body.recruiterId) : null;
    }
    
    await job.save();
    if (body.skillIds) {
      await JobSkill.destroy({ where: { jobId: job.id } });
      if (body.skillIds.length) {
        await JobSkill.bulkCreate(body.skillIds.map((skillId) => ({ jobId: job.id, skillId })));
      }
    }
    return job;
  }

  async assignRecruiter(userId, jobId, recruiterIdOrEmail) {
    const job = await this.assertCompanyJob(userId, jobId);
    
    if (!recruiterIdOrEmail) {
      job.recruiterId = null;
      await job.save();
      return job;
    }
    
    let recruiterId = recruiterIdOrEmail;
    
    // Check if it's an email (contains @ symbol)
    if (typeof recruiterIdOrEmail === 'string' && recruiterIdOrEmail.includes('@')) {
      const recruiterUser = await require('../models').User.findOne({ where: { email: recruiterIdOrEmail } });
      if (!recruiterUser) throw new ApiError(404, 'Recruiter email not found');
      const employer = await employerService.companyOf(userId);
      const recruiter = await Recruiter.findOne({ where: { userId: recruiterUser.id, companyId: employer.companyId } });
      if (!recruiter) throw new ApiError(400, 'Recruiter not part of your company');
      recruiterId = recruiter.id;
    } else {
      recruiterId = Number(recruiterIdOrEmail);
    }
    
    job.recruiterId = recruiterId;
    await job.save();
    return job;
  }

  async syncJobFillStatus(jobId) {
    const job = await Job.findByPk(jobId);
    if (!job || job.status === 'closed') return job;

    // Only count applications where worker has ACCEPTED the offer (joined status)
    const acceptedCount = await Application.count({
      where: {
        jobId,
        status: 'joined',
      },
    });

    if (job.vacancies > 0 && acceptedCount >= normalizeVacancyCount(job.vacancies, 1)) {
      job.status = 'closed';
      await job.save();
    }

    return job;
  }

  async remove(userId, id) {
    const job = await this.assertCompanyJob(userId, id);
    await job.destroy();
    return { message: 'Job deleted' };
  }

  async setStatus(userId, id, status) {
    const job = await this.assertCompanyJob(userId, id);
    job.status = status;
    await job.save();
    return job;
  }

  async assertCompanyJob(userId, id) {
    const job = await Job.findByPk(id);
    if (!job) throw new ApiError(404, 'Job not found');
    const { Employer } = require('../models');
    const emp = await Employer.findOne({ where: { userId } });
    const rec = await Recruiter.findOne({ where: { userId } });
    const companyId = emp?.companyId || rec?.companyId;
    if (job.companyId !== companyId) throw new ApiError(403, 'Not your company job');
    return job;
  }

  async companyJobs(userId, query) {
    const { Employer } = require('../models');
    const emp = await Employer.findOne({ where: { userId } });
    const rec = await Recruiter.findOne({ where: { userId } });
    const companyId = emp?.companyId || rec?.companyId;
    const where = { companyId };
    if (query.status) where.status = query.status;
    const jobs = await Job.findAll({
      where,
      include: [
        Company,
        { model: Recruiter, attributes: ['id', 'fullName', 'designation', 'phone'] },
        { model: Skill, through: { attributes: [] } },
      ],
      order: [['createdAt', 'DESC']],
    });

    // Add accepted count for each job
    const jobsWithStats = await Promise.all(
      jobs.map(async (job) => {
        const acceptedCount = await Application.count({
          where: {
            jobId: job.id,
            status: 'joined',
          },
        });
        return {
          ...job.toJSON(),
          acceptedCount,
        };
      })
    );

    return jobsWithStats;
  }

  async publicSearch(query) {
    const {
      q, city, skill, minSalary, jobType, shift, accommodation, page = 1, limit = 12,
    } = query;
    const where = { status: 'published', vacancies: { [Op.gt]: 0 } };
    if (q) where[Op.or] = [
      { title: { [Op.like]: `%${q}%` } },
      { description: { [Op.like]: `%${q}%` } },
    ];
    if (city) where.city = { [Op.like]: `%${city}%` };
    if (jobType) where.jobType = jobType;
    if (shift) where.shift = shift;
    if (accommodation === 'true') where.accommodation = true;
    if (minSalary) where.salaryMax = { [Op.gte]: Number(minSalary) };
    const include = [
      { model: Company, attributes: ['id', 'name', 'logo', 'verificationStatus', 'city', 'industry'] },
      { model: Skill, through: { attributes: [] } },
    ];
    if (skill) include[1].where = { name: { [Op.like]: `%${skill}%` } };
    return Job.findAndCountAll({
      where,
      include,
      distinct: true,
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
      order: [['createdAt', 'DESC']],
    });
  }

  async getPublic(id) {
    const job = await Job.findByPk(id, {
      include: [Company, { model: Skill, through: { attributes: [] } }],
    });
    if (!job) throw new ApiError(404, 'Job not found');
    return job;
  }
}

module.exports = new JobService();
