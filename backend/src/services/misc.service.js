const { Notification, Complaint } = require('../models');
const { upload } = require('../middleware/upload');
const { configured, cloudinary } = require('../config/cloudinary');
const path = require('path');
const env = require('../config/env');

class MiscService {
  notifications(userId) {
    return Notification.findAll({ where: { userId }, order: [['createdAt', 'DESC']], limit: 50 });
  }

  async markRead(userId, id) {
    await Notification.update({ isRead: true }, { where: { id, userId } });
    return { message: 'ok' };
  }

  async markAllRead(userId) {
    await Notification.update({ isRead: true }, { where: { userId } });
    return { message: 'ok' };
  }

  fileUrl(filename) {
    if (configured) return null;
    return `${env.clientUrl.replace('5173', '5000')}/uploads/${filename}`;
  }

  async handleUpload(file) {
    if (!file) return null;
    if (configured) {
      const result = await cloudinary.uploader.upload(file.path, { folder: 'workforce-connect' });
      return result.secure_url;
    }
    return `/uploads/${file.filename}`;
  }

  raiseComplaint(userId, body) {
    return Complaint.create({ raisedBy: userId, ...body });
  }
}

module.exports = new MiscService();
