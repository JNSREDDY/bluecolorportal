const adminService = require('../services/admin.service');
const { asyncHandler } = require('../utils/apiError');
const { success } = require('../utils/response');

const dashboard = asyncHandler(async (req, res) => success(res, await adminService.dashboard()));
const companies = asyncHandler(async (req, res) => success(res, await adminService.companies(req.query.status)));
const companyStatus = asyncHandler(async (req, res) => success(res, await adminService.setCompanyStatus(req.user.id, req.params.id, req.body.status || req.body.verificationStatus, req.body.notes)));
const verifyWorker = asyncHandler(async (req, res) => success(res, await adminService.verifyWorker(req.user.id, req.params.id, req.body.approved)));
const verifyCert = asyncHandler(async (req, res) => success(res, await adminService.verifyCertificate(req.params.id, req.body.verified)));
const users = asyncHandler(async (req, res) => success(res, await adminService.users(req.query)));
const userActive = asyncHandler(async (req, res) => success(res, await adminService.setUserActive(req.params.id, req.body.isActive)));
const jobs = asyncHandler(async (req, res) => success(res, await adminService.jobs(req.query)));
const closeJob = asyncHandler(async (req, res) => success(res, await adminService.closeJob(req.params.id)));
const complaints = asyncHandler(async (req, res) => success(res, await adminService.complaints()));
const resolve = asyncHandler(async (req, res) => success(res, await adminService.resolveComplaint(req.params.id, req.body.status, req.body.resolution)));
const logs = asyncHandler(async (req, res) => success(res, await adminService.auditLogs(req.query.page)));
const settings = asyncHandler(async (req, res) => success(res, await adminService.settings()));
const saveSetting = asyncHandler(async (req, res) => success(res, await adminService.upsertSetting(req.body.key, req.body.value)));
const fraud = asyncHandler(async (req, res) => success(res, await adminService.fraudSignals()));
const pendingCerts = asyncHandler(async (req, res) => success(res, await adminService.pendingCertificates()));
const pendingWorkers = asyncHandler(async (req, res) => success(res, await adminService.pendingWorkers()));

module.exports = {
  dashboard, companies, companyStatus, verifyWorker, verifyCert, users, userActive, jobs, closeJob,
  complaints, resolve, logs, settings, saveSetting, fraud, pendingCerts, pendingWorkers,
};
