import { Request, Response, NextFunction } from "express";
import moment from "moment";
import logger from "../shared/utils/logger";
import { isDev } from "../config/env";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;

  // Only trust err.message for operational errors
  let message = err.statusCode ? err.message : "Internal Server Error";

  // Prisma unique constraint
  if (err.code === "P2002") {
    statusCode = 409;
    message = "Duplicate entry – record already exists";
  }

  // Prisma record not found
  if (err.code === "P2025") {
    statusCode = 404;
    message = "Record not found";
  }

  // JWT
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  logger.error(message, {
    method: req.method,
    url: req.originalUrl,
    status: statusCode,
    stack: err.stack,
  });

  let code = "server_error";

  if (statusCode === 400) code = "bad_request";
  else if (statusCode === 401) code = "unauthorized";
  else if (statusCode === 403) code = "forbidden";
  else if (statusCode === 404) code = "not_found";
  else if (statusCode === 409) code = "conflict";
  else if (statusCode === 422) code = "validation_error";

  res.status(statusCode).json({
    code,
    success: false,
    statusCode,
    message,
    timestamp: moment().format("DD-MM-YYYY HH:mm"),
    path: `${req.protocol}://${req.get("host") || "localhost"}${req.originalUrl}`,
    ...(isDev && { stack: err.stack }),
  });
};

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    code: "not_found",
    success: false,
    statusCode: 404,
    message: `Route ${req.originalUrl} not found`,
    timestamp: moment().format("DD-MM-YYYY HH:mm"),
    path: `${req.protocol}://${req.get("host") || "localhost"}${req.originalUrl}`,
  });
};

export default {
  errorHandler,
  notFound,
};