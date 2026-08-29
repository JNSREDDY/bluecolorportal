const router = require('express').Router();
const c = require('../controllers/worker.controller');
const { authenticate, authorize } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { audit } = require('../middleware/audit');

const jobService = require('../services/job.service');
const { asyncHandler } = require('../utils/apiError');
const { success } = require('../utils/response');

router.use(authenticate, authorize('worker'));
router.get('/dashboard', c.dashboard);
router.get('/profile', c.profile);
router.put('/profile', c.update);
router.post('/photo', upload.single('photo'), c.photo);
router.put('/skills', c.skills);
router.post('/certificates', upload.single('file'), c.certificate);
router.post('/history', c.history);
router.get('/resume', c.resume);
router.get('/identity', c.identity);
router.get('/saved', c.saved);
router.get('/jobs', asyncHandler(async (req, res) => success(res, await jobService.publicSearch(req.query))));
router.get('/jobs/:id', asyncHandler(async (req, res) => success(res, await jobService.getPublic(req.params.id))));
router.post('/jobs/:jobId/save', c.save);
router.delete('/jobs/:jobId/save', c.unsave);
router.post('/jobs/:jobId/apply', audit('apply_job', 'job'), c.apply);
router.get('/applications', c.applications);
router.get('/interviews', c.interviews);
router.get('/offers', c.offers);
router.post('/offers/:offerId/respond', c.respondOffer);

module.exports = router;
