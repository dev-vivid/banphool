import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../../middleware/authMiddleware";
import beneficiaryUseCase from "../usecase/beneficiaryUseCase";
import response from "../../../shared/utils/response";
import { MESSAGES } from "../../../constants";

export const getAll = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { data, pagination } = await beneficiaryUseCase.getAll(req.query);

    return response.paginated(res, req, data, pagination);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await beneficiaryUseCase.getById(req.params.id);

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
    const body = {
      ...req.body,
    };

    if ((req.files as any)?.aadharImageUpload?.length) {
      body.aadharImageUpload = (req.files as any).aadharImageUpload[0].filename;
    }

    if ((req.files as any)?.supportDocument?.length) {
      body.supportDocument = (req.files as any).supportDocument[0].filename;
    }

    const data = await beneficiaryUseCase.create(body, req);

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
    const body = {
      ...req.body,
    };

    if ((req.files as any)?.aadharImageUpload?.length) {
      body.aadharImageUpload = (req.files as any).aadharImageUpload[0].filename;
    }

    if ((req.files as any)?.supportDocument?.length) {
      body.supportDocument = (req.files as any).supportDocument[0].filename;
    }

    const data = await beneficiaryUseCase.update(
      req.params.id,
      body,
      req
    );

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
    await beneficiaryUseCase.remove(req.params.id, req);

    return response.success(res, req, {}, MESSAGES.DELETED);
  } catch (err: any) {
    if (err.statusCode) {
      return response.error(res, req, err.message, err.statusCode);
    }

    next(err);
  }
};


export const updateStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await beneficiaryUseCase.updateStatus(
      req.params.id,
      req.body.isActive,
      req
    );

    return response.success(
      res,
      req,
      data,
      req.body.isActive
        ? "Volunteer activated successfully"
        : "Volunteer deactivated successfully"
    );
  } catch (err: any) {
    if (err.statusCode) {
      return response.error(
        res,
        req,
        err.message,
        err.statusCode
      );
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
  updateStatus
};