import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../../middleware/authMiddleware";
import authUseCase from "../usecase/authUseCase";
import response from "../../../shared/utils/response";

/**
 * Register
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authUseCase.register(
      req.body,
      req as AuthenticatedRequest
    );

    return response.created(
      res,
      req,
      result,
      "Registration successful"
    );
  } catch (error: any) {
    if (error.statusCode) {
      return response.error(
        res,
        req,
        error.message,
        error.statusCode
      );
    }

    next(error);
  }
};

/**
 * Login
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authUseCase.login(
      req.body,
      req as AuthenticatedRequest
    );

    return response.success(
      res,
      req,
      result,
      "Login successful"
    );
  } catch (error: any) {
    if (error.statusCode) {
      return response.error(
        res,
        req,
        error.message,
        error.statusCode
      );
    }

    next(error);
  }
};

/**
 * Refresh Token
 */
export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authUseCase.refresh(req.body);

    return response.success(
      res,
      req,
      result,
      "Token refreshed"
    );
  } catch (error: any) {
    if (error.statusCode) {
      return response.error(
        res,
        req,
        error.message,
        error.statusCode
      );
    }

    next(error);
  }
};

/**
 * Logout
 */
export const logout = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    await authUseCase.logout(req);

    return response.success(
      res,
      req,
      {},
      "Logged out successfully"
    );
  } catch (error: any) {
    if (error.statusCode) {
      return response.error(
        res,
        req,
        error.message,
        error.statusCode
      );
    }

    next(error);
  }
};

/**
 * Get Logged-in User
 */
export const me = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.id) {
      return response.unauthorized(
        res,
        "Not authenticated"
      );
    }

    const result = await authUseCase.getMe(req.user.id);

    return response.success(
      res,
      req,
      result
    );
  } catch (error: any) {
    if (error.statusCode) {
      return response.error(
        res,
        req,
        error.message,
        error.statusCode
      );
    }

    next(error);
  }
};

export default {
  register,
  login,
  refresh,
  logout,
  me,
};