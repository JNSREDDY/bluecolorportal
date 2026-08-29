const router = require('express').Router();
const c = require('../controllers/recruiter.controller');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate, authorize('recruiter'));

router.get('/dashboard', c.dashboard);
router.get('/jobs', c.jobs);
router.get('/applications', c.applications);
router.patch('/applications/:id', c.appStatus);
router.put('/applications/:id', c.appStatus);
router.put('/applications/:id/status', c.appStatus);
router.post('/applications/:id/interview', c.interview);
router.post('/interviews/:id/complete', c.completeInterview);
router.post('/applications/:id/offer', c.offer);
router.post('/notes', c.note);
router.get('/notes/:workerId', c.notes);
router.get('/candidates', c.candidates);
router.post('/messages', c.message);
router.get('/messages/:userId', c.thread);

module.exports = router;
