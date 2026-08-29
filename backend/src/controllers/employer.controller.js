const employerService = require('../services/employer.service');
const jobService = require('../services/job.service');
const applicationService = require('../services/application.service');
const miscService = require('../services/misc.service');
const { asyncHandler } = require('../utils/apiError');
const { success } = require('../utils/response');

const dashboard = asyncHandler(async (req, res) => success(res, await employerService.dashboard(req.user.id)));
const company = asyncHandler(async (req, res) => success(res, (await employerService.companyOf(req.user.id)).Company));
const updateCompany = asyncHandler(async (req, res) => success(res, await employerService.updateCompany(req.user.id, req.body)));
const logo = asyncHandler(async (req, res) => {
  const logo = await miscService.handleUpload(req.file);
  success(res, await employerService.updateCompany(req.user.id, { logo }));
});
const invite = asyncHandler(async (req, res) => success(res, await employerService.inviteRecruiter(req.user.id, req.body), 'Invited', 201));
const recruiters = asyncHandler(async (req, res) => success(res, await employerService.recruiters(req.user.id)));
const recruiterStatus = asyncHandler(async (req, res) => success(res, await employerService.setRecruiterStatus(req.user.id, req.params.id, req.body.status)));
const jobs = asyncHandler(async (req, res) => success(res, await jobService.companyJobs(req.user.id, req.query)));
const createJob = asyncHandler(async (req, res) => success(res, await jobService.create(req.user.id, req.body), 'Created', 201));
const updateJob = asyncHandler(async (req, res) => success(res, await jobService.update(req.user.id, req.params.id, req.body)));
const deleteJob = asyncHandler(async (req, res) => success(res, await jobService.remove(req.user.id, req.params.id)));
const jobStatus = asyncHandler(async (req, res) => success(res, await jobService.setStatus(req.user.id, req.params.id, req.body.status)));
const assignJobRecruiter = asyncHandler(async (req, res) => success(res, await jobService.assignRecruiter(req.user.id, req.params.id, req.body.recruiterId)));
const applications = asyncHandler(async (req, res) => success(res, await applicationService.list(req.user.id, req.query)));
const appStatus = asyncHandler(async (req, res) => success(res, await applicationService.setStatus(req.user.id, req.params.id, req.body.status)));
const assignAppRecruiter = asyncHandler(async (req, res) => success(res, await applicationService.assignRecruiter(req.user.id, req.params.id, req.body.recruiterId)));
const interview = asyncHandler(async (req, res) => success(res, await applicationService.scheduleInterview(req.user.id, req.params.id, req.body), 'Scheduled', 201));
const offer = asyncHandler(async (req, res) => success(res, await applicationService.createOffer(req.user.id, req.params.id, req.body), 'Offer sent', 201));

module.exports = {
  dashboard, company, updateCompany, logo, invite, recruiters, recruiterStatus,
  jobs, createJob, updateJob, deleteJob, jobStatus, assignJobRecruiter, applications, appStatus, assignAppRecruiter, interview, offer,
};
