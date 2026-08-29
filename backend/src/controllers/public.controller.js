const jobService = require('../services/job.service');
const searchService = require('../services/search.service');
const aiService = require('../services/ai.service');
const miscService = require('../services/misc.service');
const recruiterService = require('../services/recruiter.service');
const { asyncHandler } = require('../utils/apiError');
const { success } = require('../utils/response');

const jobs = asyncHandler(async (req, res) => success(res, await jobService.publicSearch(req.query)));
const job = asyncHandler(async (req, res) => success(res, await jobService.getPublic(req.params.id)));
const companies = asyncHandler(async (req, res) => success(res, await searchService.companies(req.query)));
const workers = asyncHandler(async (req, res) => success(res, await searchService.workers(req.query)));
const skills = asyncHandler(async (req, res) => success(res, await searchService.skills(req.query.q)));
const ai = asyncHandler(async (req, res) => {
  const map = {
    resume: () => aiService.resumeBuilder(req.body),
    candidates: () => aiService.recommendCandidates(req.body.jobId),
    jobs: () => aiService.recommendJobs(req.body.workerId),
    chatbot: () => aiService.chatbot(req.body.message, req.body.context),
    'skill-gap': () => aiService.skillGap(req.body.workerId, req.body.jobId),
  };
  const fn = map[req.params.feature];
  if (!fn) return success(res, { status: 'unknown_feature' }, 'Unknown', 404);
  success(res, await fn());
});
const notifications = asyncHandler(async (req, res) => success(res, await miscService.notifications(req.user.id)));
const readOne = asyncHandler(async (req, res) => success(res, await miscService.markRead(req.user.id, req.params.id)));
const readAll = asyncHandler(async (req, res) => success(res, await miscService.markAllRead(req.user.id)));
const complaint = asyncHandler(async (req, res) => success(res, await miscService.raiseComplaint(req.user.id, req.body), 'Filed', 201));
const message = asyncHandler(async (req, res) => success(res, await recruiterService.sendMessage(req.user.id, req.body)));
const thread = asyncHandler(async (req, res) => success(res, await recruiterService.thread(req.user.id, req.params.userId)));

module.exports = {
  jobs, job, companies, workers, skills, ai, notifications, readOne, readAll, complaint, message, thread,
};
