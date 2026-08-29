const router = require('express').Router();
const c = require('../controllers/auth.controller');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const v = require('../validators/auth.validators');

router.post('/register/worker', v.registerWorkerRules, validate, c.registerWorker);
router.post('/register/employer', v.registerEmployerRules, validate, c.registerEmployer);
router.post('/login', v.loginRules, validate, c.login);
router.post('/refresh', c.refresh);
router.post('/forgot-password', v.emailOnlyRules, validate, c.forgot);
router.post('/reset-password', v.resetRules, validate, c.reset);
router.get('/me', authenticate, c.me);
router.post('/password', authenticate, c.setPassword);
router.post('/logout', c.logout);

module.exports = router;
