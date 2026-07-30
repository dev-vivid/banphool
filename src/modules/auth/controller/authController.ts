import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../../middleware/authMiddleware";
import useCase from "../usecase/authUseCase";
import response from "../../../shared/utils/response";

export const register = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await useCase.register(req.body, req);
    return response.created(res, req, data, "Registration successful");
  } catch (err: any) {
    if (err.statusCode) {
      return response.error(res, req, err.message, err.statusCode);
    }
    next(err);
  }
};

export const login = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await useCase.login(req.body, req);
    return response.success(res, req, data, "Login successful");
  } catch (err: any) {
    if (err.statusCode) {
      return response.error(res, req, err.message, err.statusCode);
    }
    next(err);
  }
};

export const refresh = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await useCase.refresh(req.body);
    return response.success(res, req, data, "Token refreshed");
  } catch (err: any) {
    if (err.statusCode) {
      return response.error(res, req, err.message, err.statusCode);
    }
    next(err);
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await useCase.logout(req);
    return response.success(res, req, {}, "Logged out successfully");
  } catch (err: any) {
    if (err.statusCode) {
      return response.error(res, req, err.message, err.statusCode);
    }
    next(err);
  }
};

export const me = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return response.unauthorized(res, "Not authenticated");
    }
    const data = await useCase.getMe(userId);
    return response.success(res, req, data);
  } catch (err: any) {
    if (err.statusCode) {
      return response.error(res, req, err.message, err.statusCode);
    }
    next(err);
  }
};

export default {
  register,
  login,
  refresh,
  logout,
  me,
};