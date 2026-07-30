import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import prisma from "../config/prisma";
import env from "../config/env";

export const signAccess = (payload: any): string =>
  jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn as any });

export const signRefresh = (payload: any): string =>
  jwt.sign(payload, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpiresIn as any });

export const verifyAccess = (token: string): any =>
  jwt.verify(token, env.jwt.secret);

export const verifyRefresh = (token: string): any =>
  jwt.verify(token, env.jwt.refreshSecret);

export const saveRefreshToken = async (
  userId: string,
  token: string,
  ipAddress: string
): Promise<void> => {
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({
    data: { id: uuidv4(), userId, token, expiresAt, ipAddress },
  });
};

export const findValidRefreshToken = (userId: string) =>
  prisma.refreshToken.findFirst({
    where: { userId, isRevoked: false, expiresAt: { gt: new Date() } },
  });

export const revokeAllTokens = (userId: string) =>
  prisma.refreshToken.updateMany({
    where: { userId },
    data: { isRevoked: true },
  });

export default {
  signAccess,
  signRefresh,
  verifyAccess,
  verifyRefresh,
  saveRefreshToken,
  findValidRefreshToken,
  revokeAllTokens,
};
