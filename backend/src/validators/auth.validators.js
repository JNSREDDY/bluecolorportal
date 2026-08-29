const { body } = require('express-validator');

const registerWorkerRules = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('phone').optional().isMobilePhone('en-IN'),
];

const registerEmployerRules = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('fullName').trim().notEmpty(),
  body('companyName').trim().notEmpty(),
  body('gst').optional().trim(),
  body('pan').optional().trim(),
  body('industry').optional().trim(),
];

const loginRules = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];



const emailOnlyRules = [body('email').isEmail().normalizeEmail()];

const resetRules = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
];

const inviteRecruiterRules = [
  body('email').isEmail().normalizeEmail(),
  body('fullName').trim().notEmpty(),
];

const jobRules = [
  body('title').trim().notEmpty(),
  body('description').optional(),
  body('city').optional(),
  body('salaryMin').optional().isInt(),
  body('salaryMax').optional().isInt(),
];

module.exports = {
  registerWorkerRules,
  registerEmployerRules,
  loginRules,
  emailOnlyRules,
  resetRules,
  inviteRecruiterRules,
  jobRules,
};
