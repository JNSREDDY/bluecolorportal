const workerService = require('../services/worker.service');
const applicationService = require('../services/application.service');
const miscService = require('../services/misc.service');
const { asyncHandler } = require('../utils/apiError');
const { success } = require('../utils/response');

const profile = asyncHandler(async (req, res) => success(res, await workerService.getProfile(req.user.id)));
const update = asyncHandler(async (req, res) => success(res, await workerService.updateProfile(req.user.id, req.body)));
const skills = asyncHandler(async (req, res) => success(res, await workerService.setSkills(req.user.id, req.body.skills)));
const certificate = asyncHandler(async (req, res) => {
  const fileUrl = await miscService.handleUpload(req.file);
  success(res, await workerService.addCertificate(req.user.id, { ...req.body, fileUrl }), 'Certificate added', 201);
});
const history = asyncHandler(async (req, res) => success(res, await workerService.addHistory(req.user.id, req.body), 'Added', 201));
const resume = asyncHandler(async (req, res) => success(res, await workerService.resume(req.user.id)));
const identity = asyncHandler(async (req, res) => success(res, await workerService.identity(req.user.id)));
const save = asyncHandler(async (req, res) => success(res, await workerService.saveJob(req.user.id, req.params.jobId)));
const unsave = asyncHandler(async (req, res) => success(res, await workerService.unsaveJob(req.user.id, req.params.jobId)));
const saved = asyncHandler(async (req, res) => success(res, await workerService.savedJobs(req.user.id)));
const apply = asyncHandler(async (req, res) => success(res, await workerService.apply(req.user.id, req.params.jobId, req.body.coverNote), 'Applied', 201));
const applications = asyncHandler(async (req, res) => success(res, await workerService.myApplications(req.user.id)));
const interviews = asyncHandler(async (req, res) => success(res, await applicationService.workerInterviews(req.user.id)));
const offers = asyncHandler(async (req, res) => success(res, await applicationService.workerOffers(req.user.id)));
const respondOffer = asyncHandler(async (req, res) => success(res, await applicationService.respondOffer(req.user.id, req.params.offerId, req.body.status)));
const dashboard = asyncHandler(async (req, res) => success(res, await workerService.dashboard(req.user.id)));
const photo = asyncHandler(async (req, res) => {
  const photo = await miscService.handleUpload(req.file);
  success(res, await workerService.updateProfile(req.user.id, { photo }));
});

module.exports = {
  profile, update, skills, certificate, history, resume, identity, save, unsave, saved, apply,
  applications, interviews, offers, respondOffer, dashboard, photo,
};
