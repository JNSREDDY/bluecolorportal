const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const QRCode = require('qrcode');
const env = require('../config/env');
const userRepo = require('../repositories/user.repository');
const {
  User, Worker, Employer, Recruiter, Company, VerificationRequest,
} = require('../models');
const { ApiError } = require('../utils/apiError');
const { sendMail } = require('../utils/mailer');
const { signAccess, signRefresh } = require('../utils/tokens');
const { notify } = require('./notification.service');



const publicUser = (user) => ({
  id: user.id,
  email: user.email,
  role: user.role,
  isEmailVerified: user.isEmailVerified,
  isActive: user.isActive,
});

class AuthService {
  async registerWorker(payload) {
    let user = await userRepo.findByEmail(payload.email);
    if (user) {
      if (user.isEmailVerified) {
        throw new ApiError(409, 'Email is already registered. Please log in with your credentials.');
      }
      user.password = await bcrypt.hash(payload.password, 12);
      user.isEmailVerified = true;
      await user.save();
    } else {
      const password = await bcrypt.hash(payload.password, 12);
      user = await User.create({
        email: payload.email,
        password,
        role: 'worker',
        isEmailVerified: true,
      });
      const digitalId = `WFC-${String(user.id).padStart(8, '0')}`;
      const qrCode = await QRCode.toDataURL(`${env.clientUrl}/id/${digitalId}`);
      await Worker.create({
        userId: user.id,
        firstName: payload.firstName,
        lastName: payload.lastName,
        phone: payload.phone,
        digitalId,
        qrCode,
        city: payload.city,
        state: payload.state,
      });
      await VerificationRequest.create({ userId: user.id, type: 'worker', status: 'pending' });
    }

    const accessToken = signAccess(user);
    const refreshToken = signRefresh(user);
    user.refreshToken = await bcrypt.hash(refreshToken, 10);
    user.lastLoginAt = new Date();
    await user.save();
    const profile = await this.me(user.id);
    return { user: publicUser(user), profile, accessToken, refreshToken, message: 'Registration successful' };
  }

  async registerEmployer(payload) {
    const existing = await userRepo.findByEmail(payload.email);
    if (existing) {
      if (existing.isEmailVerified) {
        throw new ApiError(409, 'Email is already registered. Please log in with your credentials.');
      }
      existing.password = await bcrypt.hash(payload.password, 12);
      existing.isEmailVerified = true;
      await existing.save();
      const accessToken = signAccess(existing);
      const refreshToken = signRefresh(existing);
      existing.refreshToken = await bcrypt.hash(refreshToken, 10);
      existing.lastLoginAt = new Date();
      await existing.save();
      const profile = await this.me(existing.id);
      return { user: publicUser(existing), profile, accessToken, refreshToken, message: 'Registration successful' };
    }
    const password = await bcrypt.hash(payload.password, 12);
    const user = await User.create({
      email: payload.email,
      password,
      role: 'employer',
      isEmailVerified: true,
    });
    const company = await Company.create({
      name: payload.companyName,
      gst: payload.gst,
      pan: payload.pan,
      industry: payload.industry,
      address: payload.address,
      city: payload.city,
      state: payload.state,
      pincode: payload.pincode,
      website: payload.website,
      verificationStatus: 'pending',
    });
    await Employer.create({
      userId: user.id,
      companyId: company.id,
      fullName: payload.fullName,
      phone: payload.phone,
      isOwner: true,
      designation: 'Owner',
    });
    await VerificationRequest.create({
      userId: user.id,
      type: 'employer',
      entityId: company.id,
      status: 'pending',
    });
    const accessToken = signAccess(user);
    const refreshToken = signRefresh(user);
    user.refreshToken = await bcrypt.hash(refreshToken, 10);
    user.lastLoginAt = new Date();
    await user.save();
    const profile = await this.me(user.id);
    return { user: publicUser(user), company, profile, accessToken, refreshToken, message: 'Registration successful. Company pending admin approval.' };
  }



  async login(email, password) {
    const user = await userRepo.findByEmail(email);
    if (!user) throw new ApiError(401, 'Invalid credentials');
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new ApiError(401, 'Invalid credentials');
    if (!user.isActive) throw new ApiError(403, 'Account is suspended');
    if (user.role === 'employer') {
      const employer = await Employer.findOne({ where: { userId: user.id }, include: [Company] });
      if (employer?.Company?.verificationStatus === 'suspended') {
        throw new ApiError(403, 'Company account is suspended');
      }
    }
    const accessToken = signAccess(user);
    const refreshToken = signRefresh(user);
    user.refreshToken = await bcrypt.hash(refreshToken, 10);
    user.lastLoginAt = new Date();
    await user.save();
    const profile = await this.me(user.id);
    return { user: publicUser(user), profile, accessToken, refreshToken };
  }

  async refresh(token) {
    if (!token) throw new ApiError(401, 'Refresh token missing');
    let decoded;
    try {
      decoded = jwt.verify(token, env.jwt.refreshSecret);
    } catch {
      throw new ApiError(401, 'Invalid refresh token');
    }
    const user = await User.findByPk(decoded.id);
    if (!user || !user.refreshToken) throw new ApiError(401, 'Invalid refresh token');
    const match = await bcrypt.compare(token, user.refreshToken);
    if (!match) throw new ApiError(401, 'Invalid refresh token');
    const accessToken = signAccess(user);
    const refreshToken = signRefresh(user);
    user.refreshToken = await bcrypt.hash(refreshToken, 10);
    await user.save();
    return { accessToken, refreshToken, user: publicUser(user) };
  }

  async forgotPassword(email) {
    const user = await userRepo.findByEmail(email);
    if (!user) throw new ApiError(404, 'User not found');
    sendMail({
      to: email,
      subject: 'Reset your WorkForce Connect password',
      html: `<p>To reset your password, visit: <a href="${env.clientUrl}/reset-password?email=${encodeURIComponent(email)}">Reset Password Link</a></p>`,
    }).catch((err) => {
      console.error(`[Mailer] Mail delivery failed for ${email}:`, err.message);
    });
    return { message: 'Password reset link sent to email' };
  }

  async resetPassword(email, token, password) {
    const user = await userRepo.findByEmail(email);
    if (!user) throw new ApiError(404, 'User not found');
    user.password = await bcrypt.hash(password, 12);
    user.refreshToken = null;
    await user.save();
    return { message: 'Password updated' };
  }

  async inviteRecruiter({ email, fullName, phone, designation, companyId, invitedBy, password }) {
    if (await userRepo.findByEmail(email)) throw new ApiError(409, 'Email already in use');
    const finalPassword = password && password.trim() ? password.trim() : `Recruiter@123`;
    const hashedPassword = await bcrypt.hash(finalPassword, 12);
    const user = await User.create({
      email,
      password: hashedPassword,
      role: 'recruiter',
      isEmailVerified: true,
      isActive: true,
    });
    await Recruiter.create({
      userId: user.id,
      companyId,
      invitedBy,
      fullName,
      phone,
      designation: designation || 'Recruiter',
      status: 'active',
    });
    sendMail({
      to: email,
      subject: 'Your Recruiter Account details for WorkForce Connect',
      html: `<p>Hello ${fullName},</p>
             <p>Your recruiter account has been created.</p>
             <p>Login at ${env.clientUrl}/login with password: <strong>${finalPassword}</strong></p>`,
    }).catch(() => {});
    return { user: publicUser(user), temporaryPassword: finalPassword };
  }

  async setPassword(userId, currentPassword, newPassword) {
    const user = await User.findByPk(userId);
    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) throw new ApiError(400, 'Current password is incorrect');
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    const rec = await Recruiter.findOne({ where: { userId } });
    if (rec && rec.status === 'invited') {
      rec.status = 'active';
      await rec.save();
    }
    return { message: 'Password updated' };
  }

  async me(userId) {
    const user = await User.findByPk(userId, { attributes: { exclude: ['password', 'refreshToken'] } });
    if (!user) throw new ApiError(404, 'User not found');
    const extra = {};
    if (user.role === 'worker') extra.worker = await Worker.findOne({ where: { userId } });
    if (user.role === 'employer') {
      extra.employer = await Employer.findOne({ where: { userId }, include: [Company] });
    }
    if (user.role === 'recruiter') {
      extra.recruiter = await Recruiter.findOne({ where: { userId }, include: [Company] });
    }
    return { user, ...extra };
  }
}

module.exports = new AuthService();
