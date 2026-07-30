import { startTokenCleanupTask } from "./cleanupTokens";
import logger from "../shared/utils/logger";

/**
 * Register & start all background tasks
 * Called once from server.ts after app starts
 */
export const startAllTasks = () => {
  if (process.env.NODE_ENV === "test") return; // skip in test env

  startTokenCleanupTask();
  logger.info("✅ All background tasks started");
};
