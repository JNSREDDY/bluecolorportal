const { Message, RecruiterNote, Recruiter, Job, Application, Worker, Skill, Company } = require('../models');
const { ApiError } = require('../utils/apiError');
const { notify } = require('./notification.service');
const { getIo } = require('../sockets/io');

class RecruiterService {
  async profile(userId) {
    const rec = await Recruiter.findOne({ where: { userId }, include: [Company] });
    if (!rec) throw new ApiError(404, 'Recruiter not found');
    return rec;
  }

  async dashboard(userId) {
    const rec = await this.profile(userId);
    const jobs = await Job.findAll({ where: { companyId: rec.companyId } });
    const jobIds = jobs.map((j) => j.id);
    const applications = jobIds.length ? await Application.count({ where: { jobId: jobIds } }) : 0;
    const interviews = await require('../models').Interview.count({
      include: [{ model: Application, where: jobIds.length ? { jobId: jobIds } : { id: 0 } }],
    });
    return {
      recruiter: rec,
      stats: { assignedJobs: jobs.length, applications, interviews },
    };
  }

  async addNote(userId, body) {
    const rec = await this.profile(userId);
    return RecruiterNote.create({ recruiterId: rec.id, ...body });
  }

  async notes(userId, workerId) {
    const rec = await this.profile(userId);
    return RecruiterNote.findAll({ where: { recruiterId: rec.id, workerId }, order: [['createdAt', 'DESC']] });
  }

  async sendMessage(userId, { receiverId, body, applicationId }) {
    const msg = await Message.create({ senderId: userId, receiverId, applicationId, body });
    const io = getIo();
    if (io) io.to(`user:${receiverId}`).emit('chat:message', msg);
    await notify({ userId: receiverId, title: 'New message', message: body.slice(0, 80), type: 'chat' });
    return msg;
  }

  async thread(userId, otherId) {
    const { Op } = require('sequelize');
    return Message.findAll({
      where: {
        [Op.or]: [
          { senderId: userId, receiverId: otherId },
          { senderId: otherId, receiverId: userId },
        ],
      },
      order: [['createdAt', 'ASC']],
    });
  }
}

module.exports = new RecruiterService();
