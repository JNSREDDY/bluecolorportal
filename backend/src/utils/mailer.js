const nodemailer = require('nodemailer');
const env = require('../config/env');
const logger = require('./logger');

const canSend = Boolean(env.smtp.user && env.smtp.pass);

const transporter = canSend
  ? nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: false,
    auth: { user: env.smtp.user, pass: env.smtp.pass },
  })
  : null;

const sendMail = async ({ to, subject, html }) => {
  if (!canSend) {
    logger.info(`[email-dev] to=${to} subject=${subject}`);
    return { mocked: true };
  }
  return transporter.sendMail({ from: env.smtp.from, to, subject, html });
};

module.exports = { sendMail };
