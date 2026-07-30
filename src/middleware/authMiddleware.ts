import { Response, NextFunction } from "express";
import { Request as ExpressRequest } from "express";
import prisma from "../config/prisma";
import tokenService from "../services/tokenService";
import response from "../shared/utils/response";
import { MESSAGES } from "../constants";

export interface AuthenticatedRequest extends ExpressRequest {
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
  };
}

/**
 * authenticate — verify Bearer JWT, attach req.user
 */
export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return response.unauthorized(res, MESSAGES.UNAUTHORIZED);
    }

    const token = header.split(" ")[1];

    let decoded: any;
    try {
      decoded = tokenService.verifyAccess(token);
    } catch (e: any) {
      const msg = e.name === "TokenExpiredError" ? MESSAGES.TOKEN_EXPIRED : MESSAGES.INVALID_TOKEN;
      return response.unauthorized(res, msg);
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return response.unauthorized(res, "User not found or deactivated");
    }

    req.user = user;
    next();
  } catch {
    return response.unauthorized(res, "Authentication failed");
  }
};

/**
 * authorize — restrict to roles
 * Usage: authorize('ADMIN')  or  authorize('ADMIN', 'MANAGER')
 */
export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return response.forbidden(res, MESSAGES.FORBIDDEN);
    }
    next();
  };
};

export default { authenticate, authorize };
