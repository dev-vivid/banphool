import cron from "node-cron";
import prisma from "../config/prisma";
import logger from "../shared/utils/logger";

/**
 * Task: Clean up expired & revoked refresh tokens
 * Schedule: every day at midnight
 */
export const cleanupExpiredTokens = async () => {
  try {
    const result = await prisma.refreshToken.deleteMany({
      where: {
        OR: [{ expiresAt: { lt: new Date() } }, { isRevoked: true }],
      },
    });
    logger.info(`🧹 Token cleanup: removed ${result.count} expired/revoked tokens`);
  } catch (err: any) {
    logger.error("Token cleanup task failed", { error: err.message });
  }
};

/**
 * Start the scheduled job
 * Cron: '0 0 * * *' = every day at 00:00
 */
export const startTokenCleanupTask = () => {
  cron.schedule("0 0 * * *", cleanupExpiredTokens, {
    timezone: "UTC",
  });
  logger.info("⏰ Token cleanup task scheduled (daily at midnight UTC)");
};
