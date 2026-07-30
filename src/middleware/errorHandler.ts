const logger  = require('../shared/utils/logger');
const { isDev } = require('../config/env');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  // Only trust err.message for operational errors we threw on purpose (statusCode set).
  // Unexpected/programming errors (statusCode missing) get a generic message so internals
  // (DB errors, TypeErrors, etc.) never leak to the client.
  let message = err.statusCode ? err.message : 'Internal Server Error';

  // Prisma unique constraint
  if (err.code === 'P2002')  { statusCode = 409; message = 'Duplicate entry – record already exists'; }
  // Prisma record not found
  if (err.code === 'P2025')  { statusCode = 404; message = 'Record not found'; }
  // JWT
  if (err.name === 'JsonWebTokenError') { statusCode = 401; message = 'Invalid token'; }
  if (err.name === 'TokenExpiredError') { statusCode = 401; message = 'Token expired'; }

  logger.error(message, {
    method: req.method,
    url:    req.originalUrl,
    status: statusCode,
    stack:  err.stack,
  });

  res.status(statusCode).json({
    success: false,
    message,
    ...(isDev && { stack: err.stack }),
  });
};

const notFound = (req, res) =>
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });

module.exports = { errorHandler, notFound };
