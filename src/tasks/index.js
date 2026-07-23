const { startTokenCleanupTask } = require('./cleanupTokens');
const logger = require('../shared/utils/logger');

/**
 * Register & start all background tasks
 * Called once from server.js after app starts
 */
const startAllTasks = () => {
  if (process.env.NODE_ENV === 'test') return; // skip in test env

  startTokenCleanupTask();
  logger.info('✅ All background tasks started');
};

module.exports = { startAllTasks };
