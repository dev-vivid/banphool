import authService from "../service/authService";
import tokenService from "../../../services/tokenService";
import { writeAudit } from "../../../services/auditService";
import { getClientIp } from "../../../shared/helpers/ipHelper";
import { AUDIT_ACTIONS, AUDIT_STATUS } from "../../../constants";
import { AuthenticatedRequest } from "../../../middleware/authMiddleware";

/**
 * Register
 */
export const register = async (
  body: any,
  req: AuthenticatedRequest
) => {
  const exists = await authService.findByEmail(body.email);

  if (exists) {
    throw {
      statusCode: 409,
      message: "Email already registered",
    };
  }

  const user = await authService.createUser(body);

  await writeAudit({
    action: AUDIT_ACTIONS.REGISTER,
    resource: "users",
    resourceId: user.id,
    req,
    newValues: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });

  return user;
};

/**
 * Login
 */
export const login = async (
  body: any,
  req: AuthenticatedRequest
) => {
  const { email, password } = body;

  const user = await authService.findByEmail(email);

  if (!user) {
    await writeAudit({
      action: AUDIT_ACTIONS.FAILED_LOGIN,
      resource: "users",
      req,
      status: AUDIT_STATUS.FAILURE,
      newValues: { email },
    });

    throw {
      statusCode: 401,
      message: "Invalid email or password",
    };
  }

  const isPasswordValid = await authService.verifyPassword(
    password,
    user.password
  );

  if (!isPasswordValid) {
    await writeAudit({
      action: AUDIT_ACTIONS.FAILED_LOGIN,
      resource: "users",
      resourceId: user.id,
      req,
      status: AUDIT_STATUS.FAILURE,
      newValues: { email },
    });

    throw {
      statusCode: 401,
      message: "Invalid email or password",
    };
  }

  if (!user.isActive) {
    throw {
      statusCode: 403,
      message: "Your account has been deactivated",
    };
  }

  // Fire-and-forget: transparently upgrade the stored hash if it was
  // created with a slower (older) cost factor than currently configured.
  authService.rehashPasswordIfNeeded(user.id, password, user.password);

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = tokenService.signAccess(payload);
  const refreshToken = tokenService.signRefresh(payload);

  // Persist the refresh token and write the audit log concurrently —
  // they're independent DB writes, no need to serialize two round-trips.
  // writeAudit never throws (it swallows its own errors), so it's safe
  // to fire-and-forget and not hold up the response for it.
  writeAudit({
    action: AUDIT_ACTIONS.LOGIN,
    resource: "users",
    resourceId: user.id,
    req,
  });

  await tokenService.saveRefreshToken(
    user.id,
    refreshToken,
    getClientIp(req)
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

/**
 * Refresh Token
 */
export const refresh = async (body: any) => {
  const { refreshToken } = body;

  let decoded: any;

  try {
    decoded = tokenService.verifyRefresh(refreshToken);
  } catch {
    throw {
      statusCode: 401,
      message: "Invalid or expired refresh token",
    };
  }

  const token = await tokenService.findValidRefreshToken(decoded.id);

  if (!token) {
    throw {
      statusCode: 401,
      message: "Refresh token revoked or expired",
    };
  }

  return {
    accessToken: tokenService.signAccess({
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    }),
  };
};

/**
 * Logout
 */
export const logout = async (
  req: AuthenticatedRequest
) => {
  await tokenService.revokeAllTokens(req.user!.id);

  await writeAudit({
    action: AUDIT_ACTIONS.LOGOUT,
    resource: "users",
    resourceId: req.user!.id,
    req,
  });

  return true;
};

/**
 * Logged-in User
 */
export const getMe = async (id: string) => {
  const user = await authService.findById(id);

  if (!user) {
    throw {
      statusCode: 404,
      message: "User not found",
    };
  }

  return user;
};

export default {
  register,
  login,
  refresh,
  logout,
  getMe,
};