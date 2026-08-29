const authService = require('../services/auth.service');
const { asyncHandler } = require('../utils/apiError');
const { success } = require('../utils/response');
const { setRefreshCookie } = require('../utils/tokens');

const registerWorker = asyncHandler(async (req, res) => {
  const data = await authService.registerWorker(req.body);
  if (data.refreshToken) {
    setRefreshCookie(res, data.refreshToken);
  }
  success(res, data, 'Registration successful', 201);
});

const registerEmployer = asyncHandler(async (req, res) => {
  const data = await authService.registerEmployer(req.body);
  if (data.refreshToken) {
    setRefreshCookie(res, data.refreshToken);
  }
  success(res, data, 'Registration successful', 201);
});

const login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body.email, req.body.password);
  setRefreshCookie(res, data.refreshToken);
  success(res, data, 'Logged in');
});

const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken;
  const data = await authService.refresh(token);
  setRefreshCookie(res, data.refreshToken);
  success(res, data, 'Token refreshed');
});

const forgot = asyncHandler(async (req, res) => {
  const data = await authService.forgotPassword(req.body.email);
  success(res, data);
});

const reset = asyncHandler(async (req, res) => {
  const data = await authService.resetPassword(req.body.email, req.body.token, req.body.password);
  success(res, data);
});



const me = asyncHandler(async (req, res) => {
  const data = await authService.me(req.user.id);
  success(res, data);
});

const setPassword = asyncHandler(async (req, res) => {
  const data = await authService.setPassword(req.user.id, req.body.currentPassword, req.body.newPassword);
  success(res, data);
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
  success(res, {}, 'Logged out');
});

module.exports = {
  registerWorker, registerEmployer, login, refresh, forgot, reset, me, setPassword, logout,
};
