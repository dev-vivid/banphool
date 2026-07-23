require('dotenv').config();

/**
 * Centralised environment config — fail fast on missing required vars
 */
const required = ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];

required.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing required env var: ${key}`);
    process.exit(1);
  }
});

module.exports = {
  port:           parseInt(process.env.PORT) || 3000,
  nodeEnv:        process.env.NODE_ENV || 'development',
  isDev:          process.env.NODE_ENV !== 'production',

  jwt: {
    secret:           process.env.JWT_SECRET,
    expiresIn:        process.env.JWT_EXPIRES_IN        || '7d',
    refreshSecret:    process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max:      parseInt(process.env.RATE_LIMIT_MAX)       || 100,
  },

  bcryptRounds:    parseInt(process.env.BCRYPT_ROUNDS) || 12,
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
  logLevel:        process.env.LOG_LEVEL || 'debug',
};
