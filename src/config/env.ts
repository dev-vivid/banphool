import dotenv from "dotenv";

dotenv.config();

/**
 * Centralised environment config — fail fast on missing required vars
 */
const required = ["DATABASE_URL", "JWT_SECRET", "JWT_REFRESH_SECRET"];

required.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing required env var: ${key}`);
    process.exit(1);
  }
});

export const port = parseInt(process.env.PORT || "") || 3000;
export const nodeEnv = process.env.NODE_ENV || "development";
export const isDev = process.env.NODE_ENV !== "production";

export const jwt = {
  secret: process.env.JWT_SECRET as string,
  expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  refreshSecret: process.env.JWT_REFRESH_SECRET as string,
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
};

export const rateLimit = {
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "") || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX || "") || 100,
};

export const bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS || "") || 12;
export const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000").split(",");
export const logLevel = process.env.LOG_LEVEL || "debug";

export default {
  port,
  nodeEnv,
  isDev,
  jwt,
  rateLimit,
  bcryptRounds,
  allowedOrigins,
  logLevel,
};
