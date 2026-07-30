const cron   = require('node-cron');
const prisma = require('../config/prisma');
const logger = require('../shared/utils/logger');

/**
 * Task: Clean up expired & revoked refresh tokens
 * Schedule: every day at midnight
 */
const cleanupExpiredTokens = async () => {
  try {
    const result = await prisma.refreshToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { isRevoked: true },
        ],
      },
    });
    logger.info(`🧹 Token cleanup: removed ${result.count} expired/revoked tokens`);
  } catch (err) {
    logger.error('Token cleanup task failed', { error: err.message });
  }
};

/**
 * Start the scheduled job
 * Cron: '0 0 * * *' = every day at 00:00
 */
const startTokenCleanupTask = () => {
  cron.schedule('0 0 * * *', cleanupExpiredTokens, {
    timezone: 'UTC',
  });
  logger.info('⏰ Token cleanup task scheduled (daily at midnight UTC)');
};

module.exports = { startTokenCleanupTask, cleanupExpiredTokens };
