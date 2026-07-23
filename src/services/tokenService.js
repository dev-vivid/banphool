const jwt   = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const prisma = require('../config/prisma');
const env    = require('../config/env');

const signAccess = (payload) =>
  jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn });

const signRefresh = (payload) =>
  jwt.sign(payload, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpiresIn });

const verifyAccess = (token) =>
  jwt.verify(token, env.jwt.secret);

const verifyRefresh = (token) =>
  jwt.verify(token, env.jwt.refreshSecret);

const saveRefreshToken = async (userId, token, ipAddress) => {
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({
    data: { id: uuidv4(), userId, token, expiresAt, ipAddress },
  });
};

const findValidRefreshToken = (userId) =>
  prisma.refreshToken.findFirst({
    where: { userId, isRevoked: false, expiresAt: { gt: new Date() } },
  });

const revokeAllTokens = (userId) =>
  prisma.refreshToken.updateMany({
    where: { userId },
    data:  { isRevoked: true },
  });

module.exports = {
  signAccess,
  signRefresh,
  verifyAccess,
  verifyRefresh,
  saveRefreshToken,
  findValidRefreshToken,
  revokeAllTokens,
};
