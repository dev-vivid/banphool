import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../../middleware/authMiddleware";
import newsUseCase from "../usecase/newsUseCase";
import response from "../../../shared/utils/response";
import { MESSAGES } from "../../../constants";

export const getAll = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data, pagination } = await newsUseCase.getAll(req.query);
    return response.paginated(res, req, data, pagination);
  } catch (err) {
    next(err);
  }
};

export const getById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await newsUseCase.getById(req.params.id);
    return response.success(res, req, data);
  } catch (err: any) {
    if (err.statusCode) {
      return response.error(res, req, err.message, err.statusCode);
    }
    next(err);
  }
};

export const create = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = {
      ...req.body,
      document: (req as any).file?.filename,
    };

    const data = await newsUseCase.create(body, req);

    return response.created(res, req, data, MESSAGES.CREATED);
  } catch (err: any) {
    if (err.statusCode) {
      return response.error(res, req, err.message, err.statusCode);
    }
    next(err);
  }
};

export const update = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = {
      ...req.body,
      document: (req as any).file?.filename,
    };

    const data = await newsUseCase.update(req.params.id, body, req);

    return response.success(res, req, data, MESSAGES.UPDATED);
  } catch (err: any) {
    if (err.statusCode) {
      return response.error(res, req, err.message, err.statusCode);
    }
    next(err);
  }
};

export const remove = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    await newsUseCase.remove(req.params.id, req);

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