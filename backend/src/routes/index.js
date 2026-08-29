const router = require('express').Router();
const auth = require('./auth.routes');
const worker = require('./worker.routes');
const employer = require('./employer.routes');
const recruiter = require('./recruiter.routes');
const admin = require('./admin.routes');
const pub = require('./public.routes');

router.use('/auth', auth);
router.use('/worker', worker);
router.use('/employer', employer);
router.use('/recruiter', recruiter);
router.use('/admin', admin);
router.use('/', pub);

router.get('/health', (_req, res) => res.json({ success: true, service: 'workforce-connect', ts: new Date() }));

module.exports = router;
