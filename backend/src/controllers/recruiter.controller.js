const recruiterService = require('../services/recruiter.service');
const jobService = require('../services/job.service');
const applicationService = require('../services/application.service');
const workerService = require('../services/worker.service');
const { asyncHandler } = require('../utils/apiError');
const { success } = require('../utils/response');

const dashboard = asyncHandler(async (req, res) => success(res, await recruiterService.dashboard(req.user.id)));
const jobs = asyncHandler(async (req, res) => success(res, await jobService.companyJobs(req.user.id, req.query)));
const applications = asyncHandler(async (req, res) => success(res, await applicationService.list(req.user.id, req.query)));
const appStatus = asyncHandler(async (req, res) => success(res, await applicationService.setStatus(req.user.id, req.params.id, req.body.status)));
const interview = asyncHandler(async (req, res) => success(res, await applicationService.scheduleInterview(req.user.id, req.params.id, req.body)));
const completeInterview = asyncHandler(async (req, res) => success(res, await applicationService.completeInterview(req.user.id, req.params.id, req.body.notes)));
const offer = asyncHandler(async (req, res) => success(res, await applicationService.createOffer(req.user.id, req.params.id, req.body)));
const note = asyncHandler(async (req, res) => success(res, await recruiterService.addNote(req.user.id, req.body), 'Note saved', 201));
const notes = asyncHandler(async (req, res) => success(res, await recruiterService.notes(req.user.id, req.params.workerId)));
const candidates = asyncHandler(async (req, res) => success(res, await workerService.searchWorkers(req.query)));
const message = asyncHandler(async (req, res) => success(res, await recruiterService.sendMessage(req.user.id, req.body), 'Sent', 201));
const thread = asyncHandler(async (req, res) => success(res, await recruiterService.thread(req.user.id, req.params.userId)));

module.exports = {
  dashboard, jobs, applications, appStatus, interview, completeInterview, offer, note, notes, candidates, message, thread,
};
