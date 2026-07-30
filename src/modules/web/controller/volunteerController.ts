import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../../middleware/authMiddleware";
import volunteerUseCase from "../usecase/volunteerUseCase";
import response from "../../../shared/utils/response";
import { MESSAGES } from "../../../constants";

export const getAll = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { data, pagination } = await volunteerUseCase.getAll(req.query);
    return response.paginated(res, req, data, pagination);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await volunteerUseCase.getById(req.params.id);
    return response.success(res, req, data);
  } catch (err: any) {
    if (err.statusCode) {
      return response.error(res, req, err.message, err.statusCode);
    }
    next(err);
  }
};

export const create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await volunteerUseCase.create(req.body, req);
    return response.created(res, req, data, MESSAGES.CREATED);
  } catch (err: any) {
    if (err.statusCode) {
      return response.error(res, req, err.message, err.statusCode);
    }
    next(err);
  }
};

export const update = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await volunteerUseCase.update(req.params.id, req.body, req);
    return response.success(res, req, data, MESSAGES.UPDATED);
  } catch (err: any) {
    if (err.statusCode) {
      return response.error(res, req, err.message, err.statusCode);
    }
    next(err);
  }
};

export const remove = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await volunteerUseCase.remove(req.params.id, req);
    return response.success(res, req, {}, MESSAGES.DELETED);
  } catch (err: any) {
    if (err.statusCode) {
      return response.error(res, req, err.message, err.statusCode);
    }
    next(err);
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  remove,
};