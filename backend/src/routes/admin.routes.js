const router = require('express').Router();
const c = require('../controllers/admin.controller');
const { authenticate, authorize } = require('../middleware/auth');
const { audit } = require('../middleware/audit');

router.use(authenticate, authorize('admin'));

// Stats & Dashboard
router.get('/dashboard', c.dashboard);
router.get('/stats', c.dashboard);

// Companies Moderation
router.get('/companies', c.companies);
router.patch('/companies/:id', audit('company_status', 'company'), c.companyStatus);
router.put('/companies/:id', audit('company_status', 'company'), c.companyStatus);
router.put('/companies/:id/status', audit('company_status', 'company'), c.companyStatus);

// Workers & Verification
router.get('/workers/pending', c.pendingWorkers);
router.patch('/workers/:id/verify', c.verifyWorker);
router.put('/workers/:id/verify', c.verifyWorker);

// Certificates & Verification Queue
router.get('/certificates/pending', c.pendingCerts);
router.get('/verification-requests', c.pendingCerts);
router.patch('/certificates/:id', c.verifyCert);
router.put('/verification-requests/:id', c.verifyCert);

// User Directory
router.get('/users', c.users);
router.patch('/users/:id', c.userActive);
router.put('/users/:id', c.userActive);

// Job Catalog Moderation
router.get('/jobs', c.jobs);
router.patch('/jobs/:id/close', c.closeJob);
router.delete('/jobs/:id', c.closeJob);

// System Logs & Complaints
router.get('/complaints', c.complaints);
router.patch('/complaints/:id', c.resolve);
router.put('/complaints/:id', c.resolve);
router.get('/audit-logs', c.logs);
router.get('/settings', c.settings);
router.put('/settings', c.saveSetting);
router.get('/fraud', c.fraud);

module.exports = router;
