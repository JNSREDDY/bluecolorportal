const { Notification, User } = require('../models');
const { getIo } = require('../sockets/io');
const { sendMail } = require('../utils/mailer');

const notify = async ({ userId, title, message, type = 'info', metadata, email }) => {
  const row = await Notification.create({ userId, title, message, type, metadata });
  const io = getIo();
  if (io) io.to(`user:${userId}`).emit('notification', row);
  if (email) {
    const user = await User.findByPk(userId);
    if (user?.email) {
      sendMail({
        to: user.email,
        subject: title,
        html: `<p>${message}</p><p>— WorkForce Connect</p>`,
      }).catch(() => {});
    }
  }
  return row;
};

module.exports = { notify };
