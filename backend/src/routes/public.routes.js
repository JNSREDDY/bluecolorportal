const router = require('express').Router();
const c = require('../controllers/public.controller');
const { authenticate } = require('../middleware/auth');

router.get('/jobs', c.jobs);
router.get('/jobs/:id', c.job);
router.get('/companies', c.companies);
router.get('/workers', authenticate, c.workers);
router.get('/skills', c.skills);
router.post('/ai/:feature', authenticate, c.ai);

router.get('/notifications', authenticate, c.notifications);
router.patch('/notifications/:id/read', authenticate, c.readOne);
router.post('/notifications/read-all', authenticate, c.readAll);
router.post('/complaints', authenticate, c.complaint);
router.post('/messages', authenticate, c.message);
router.get('/messages/:userId', authenticate, c.thread);

module.exports = router;
