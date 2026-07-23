const useCase  = require('../usecase/productUseCase');
const response = require('../../../shared/utils/response');
const { MESSAGES } = require('../../../constants');

const getAll = async (req, res, next) => {
  try {
    const { data, pagination } = await useCase.getAll(req.query);
    return response.paginated(res, data, pagination);
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const data = await useCase.getById(req.params.id);
    return response.success(res, data);
  } catch (err) {
    if (err.statusCode) return response.error(res, err.message, err.statusCode);
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const data = await useCase.create(req.body, req);
    return response.created(res, data, MESSAGES.CREATED);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const data = await useCase.update(req.params.id, req.body, req);
    return response.success(res, data, MESSAGES.UPDATED);
  } catch (err) {
    if (err.statusCode) return response.error(res, err.message, err.statusCode);
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await useCase.remove(req.params.id, req);
    return response.success(res, {}, MESSAGES.DELETED);
  } catch (err) {
    if (err.statusCode) return response.error(res, err.message, err.statusCode);
    next(err);
  }
};

module.exports = { getAll, getById, create, update, remove };
