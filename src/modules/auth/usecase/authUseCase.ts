import authService from "../service/authService";
import tokenService from "../../../services/tokenService";
import { writeAudit } from "../../../services/auditService";
import { getClientIp } from "../../../shared/helpers/ipHelper";
import { AUDIT_ACTIONS, AUDIT_STATUS } from "../../../constants";

export const register = async (body: any, req: any) => {
  const exists = await authService.findByEmail(body.email);
  if (exists) {
    throw { statusCode: 409, message: "Email already registered" };
  }

  const user = await authService.createUser(body);

  await writeAudit({
    action: AUDIT_ACTIONS.REGISTER,
    resource: "users",
    resourceId: user.id,
    req,
    newValues: { name: user.name, email: user.email, role: user.role },
  });

  return user;
};

export const login = async ({ email, password }: any, req: any) => {
  const user = await authService.findByEmail(email);
  const valid = user && (await authService.verifyPassword(password, user.password));

  if (!valid) {
    await writeAudit({
      action: AUDIT_ACTIONS.FAILED_LOGIN,
      resource: "users",
      req,
      status: AUDIT_STATUS.FAILURE,
      newValues: { email },
    });
    throw { statusCode: 401, message: "Invalid email or password" };
  }

  if (!user.isActive) {
    throw { statusCode: 401, message: "Account deactivated" };
  }

  const payload = { id: user.id, email: user.email, role: user.role };
  const accessToken = tokenService.signAccess(payload);
  const refreshToken = tokenService.signRefresh(payload);

  await tokenService.saveRefreshToken(user.id, refreshToken, getClientIp(req));
  await writeAudit({ action: AUDIT_ACTIONS.LOGIN, resource: "users", resourceId: user.id, req });

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    accessToken,
    refreshToken,
  };
};

export const refresh = async ({ refreshToken }: any) => {
  let decoded: any;
  try {
    decoded = tokenService.verifyRefresh(refreshToken);
  } catch {
    throw { statusCode: 401, message: "Invalid or expired refresh token" };
  }

  const stored = await tokenService.findValidRefreshToken(decoded.id);
  if (!stored) {
    throw { statusCode: 401, message: "Refresh token revoked or expired" };
  }

  return {
    accessToken: tokenService.signAccess({
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    }),
  };
};

export const logout = async (req: any) => {
  await tokenService.revokeAllTokens(req.user.id);
  await writeAudit({ action: AUDIT_ACTIONS.LOGOUT, resource: "users", resourceId: req.user.id, req });
};

export const getMe = async (id: string) => {
  const user = await authService.findById(id);
  if (!user) {
    throw { statusCode: 404, message: "User not found" };
  }
  return user;
};

export default { register, login, refresh, logout, getMe };
