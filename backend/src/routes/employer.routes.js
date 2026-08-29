const router = require('express').Router();
const c = require('../controllers/employer.controller');
const { authenticate, authorize } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { validate } = require('../middleware/validate');
const { audit } = require('../middleware/audit');
const v = require('../validators/auth.validators');

router.use(authenticate, authorize('employer'));

router.get('/dashboard', c.dashboard);
router.get('/company', c.company);
router.put('/company', c.updateCompany);
router.post('/company/logo', upload.single('logo'), c.logo);

router.get('/recruiters', c.recruiters);
router.post('/recruiters/invite', v.inviteRecruiterRules, validate, c.invite);
router.patch('/recruiters/:id', c.recruiterStatus);
router.put('/recruiters/:id', c.recruiterStatus);
router.put('/recruiters/:id/deactivate', c.recruiterStatus);

router.get('/jobs', c.jobs);
router.post('/jobs', v.jobRules, validate, audit('create_job', 'job'), c.createJob);
router.put('/jobs/:id', c.updateJob);
router.put('/jobs/:id/assign-recruiter', c.assignJobRecruiter);
router.delete('/jobs/:id', c.deleteJob);
router.patch('/jobs/:id/status', c.jobStatus);

router.get('/applications', c.applications);
router.patch('/applications/:id', c.appStatus);
router.put('/applications/:id', c.appStatus);
router.put('/applications/:id/status', c.appStatus);
router.put('/applications/:id/assign-recruiter', c.assignAppRecruiter);
router.post('/applications/:id/interview', c.interview);
router.post('/applications/:id/offer', c.offer);

module.exports = router;
