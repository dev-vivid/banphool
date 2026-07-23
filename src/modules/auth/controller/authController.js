const useCase  = require('../usecase/authUseCase');
const response = require('../../../shared/utils/response');

const register = async (req, res, next) => {
  try {
    const data = await useCase.register(req.body, req);
    return response.created(res, data, 'Registration successful');
  } catch (err) {
    if (err.statusCode) return response.error(res, err.message, err.statusCode);
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const data = await useCase.login(req.body, req);
    return response.success(res, data, 'Login successful');
  } catch (err) {
    if (err.statusCode) return response.error(res, err.message, err.statusCode);
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const data = await useCase.refresh(req.body);
    return response.success(res, data, 'Token refreshed');
  } catch (err) {
    if (err.statusCode) return response.error(res, err.message, err.statusCode);
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    await useCase.logout(req);
    return response.success(res, {}, 'Logged out successfully');
  } catch (err) { next(err); }
};

const me = async (req, res, next) => {
  try {
    const data = await useCase.getMe(req.user.id);
    return response.success(res, data);
  } catch (err) { next(err); }
};

module.exports = { register, login, refresh, logout, me };
