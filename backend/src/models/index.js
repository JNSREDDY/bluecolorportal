const sequelize = require('../config/database');
const User = require('./User');
const Company = require('./Company');
const Worker = require('./Worker');
const Employer = require('./Employer');
const Recruiter = require('./Recruiter');
const Job = require('./Job');
const Application = require('./Application');
const Skill = require('./Skill');
const WorkerSkill = require('./WorkerSkill');
const JobSkill = require('./JobSkill');
const Certificate = require('./Certificate');
const Interview = require('./Interview');
const Offer = require('./Offer');
const Notification = require('./Notification');
const Rating = require('./Rating');
const EmploymentHistory = require('./EmploymentHistory');
const VerificationRequest = require('./VerificationRequest');
const CompanyDocument = require('./CompanyDocument');
const AuditLog = require('./AuditLog');
const Complaint = require('./Complaint');
const SavedJob = require('./SavedJob');
const Message = require('./Message');
const RecruiterNote = require('./RecruiterNote');
const PlatformSetting = require('./PlatformSetting');

User.hasOne(Worker, { foreignKey: 'userId' });
Worker.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Employer, { foreignKey: 'userId' });
Employer.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Recruiter, { foreignKey: 'userId' });
Recruiter.belongsTo(User, { foreignKey: 'userId' });

Company.hasMany(Employer, { foreignKey: 'companyId' });
Employer.belongsTo(Company, { foreignKey: 'companyId' });

Company.hasMany(Recruiter, { foreignKey: 'companyId' });
Recruiter.belongsTo(Company, { foreignKey: 'companyId' });

Company.hasMany(Job, { foreignKey: 'companyId' });
Job.belongsTo(Company, { foreignKey: 'companyId' });

User.hasMany(Job, { foreignKey: 'postedBy', as: 'PostedJobs' });
Job.belongsTo(User, { foreignKey: 'postedBy', as: 'Poster' });

Recruiter.hasMany(Job, { foreignKey: 'recruiterId' });
Job.belongsTo(Recruiter, { foreignKey: 'recruiterId' });

Job.hasMany(Application, { foreignKey: 'jobId' });
Application.belongsTo(Job, { foreignKey: 'jobId' });

Worker.hasMany(Application, { foreignKey: 'workerId' });
Application.belongsTo(Worker, { foreignKey: 'workerId' });

Recruiter.hasMany(Application, { foreignKey: 'recruiterId' });
Application.belongsTo(Recruiter, { foreignKey: 'recruiterId' });

Worker.belongsToMany(Skill, { through: WorkerSkill, foreignKey: 'workerId' });
Skill.belongsToMany(Worker, { through: WorkerSkill, foreignKey: 'skillId' });
Worker.hasMany(WorkerSkill, { foreignKey: 'workerId' });
WorkerSkill.belongsTo(Skill, { foreignKey: 'skillId' });
WorkerSkill.belongsTo(Worker, { foreignKey: 'workerId' });

Job.belongsToMany(Skill, { through: JobSkill, foreignKey: 'jobId' });
Skill.belongsToMany(Job, { through: JobSkill, foreignKey: 'skillId' });
Job.hasMany(JobSkill, { foreignKey: 'jobId' });
JobSkill.belongsTo(Skill, { foreignKey: 'skillId' });

Worker.hasMany(Certificate, { foreignKey: 'workerId' });
Certificate.belongsTo(Worker, { foreignKey: 'workerId' });

Application.hasMany(Interview, { foreignKey: 'applicationId' });
Interview.belongsTo(Application, { foreignKey: 'applicationId' });

Application.hasMany(Offer, { foreignKey: 'applicationId' });
Offer.belongsTo(Application, { foreignKey: 'applicationId' });

User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

Worker.hasMany(Rating, { foreignKey: 'workerId' });
Rating.belongsTo(Worker, { foreignKey: 'workerId' });
Rating.belongsTo(Company, { foreignKey: 'companyId' });

Worker.hasMany(EmploymentHistory, { foreignKey: 'workerId' });
EmploymentHistory.belongsTo(Worker, { foreignKey: 'workerId' });

Company.hasMany(CompanyDocument, { foreignKey: 'companyId' });
CompanyDocument.belongsTo(Company, { foreignKey: 'companyId' });

Worker.hasMany(SavedJob, { foreignKey: 'workerId' });
SavedJob.belongsTo(Worker, { foreignKey: 'workerId' });
SavedJob.belongsTo(Job, { foreignKey: 'jobId' });
Job.hasMany(SavedJob, { foreignKey: 'jobId' });

User.hasMany(Message, { foreignKey: 'senderId', as: 'SentMessages' });
User.hasMany(Message, { foreignKey: 'receiverId', as: 'ReceivedMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'Sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'Receiver' });

User.hasMany(VerificationRequest, { foreignKey: 'userId' });
VerificationRequest.belongsTo(User, { foreignKey: 'userId', as: 'Requester' });
VerificationRequest.belongsTo(User, { foreignKey: 'reviewedBy', as: 'Reviewer' });

User.hasMany(AuditLog, { foreignKey: 'userId' });
AuditLog.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Complaint, { foreignKey: 'raisedBy', as: 'RaisedComplaints' });
Complaint.belongsTo(User, { foreignKey: 'raisedBy', as: 'Complainant' });

module.exports = {
  sequelize,
  User,
  Company,
  Worker,
  Employer,
  Recruiter,
  Job,
  Application,
  Skill,
  WorkerSkill,
  JobSkill,
  Certificate,
  Interview,
  Offer,
  Notification,
  Rating,
  EmploymentHistory,
  VerificationRequest,
  CompanyDocument,
  AuditLog,
  Complaint,
  SavedJob,
  Message,
  RecruiterNote,
  PlatformSetting,
};
