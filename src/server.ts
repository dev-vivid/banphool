import path from "path";

import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";

import env from "./config/env";
import logger from "./shared/utils/logger";
import prisma from "./config/prisma";
import { globalLimiter } from "./middleware/rateLimiter";
import { errorHandler, notFound } from "./middleware/errorHandler";
import routes from "./routes/index";
import { startAllTasks } from "./tasks/index";





const app = express();

app.use(
  "/uploads",
  express.static(path.resolve(process.cwd(), "uploads"))
);

// ── Trust proxy ───────────────────────────────────────────────────────────────
app.set("trust proxy", 1);

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmet());
app.disable("x-powered-by");

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: (origin: string | undefined, cb: (err: Error | null, allow?: boolean) => void) => {
      if (!origin || env.allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ── Global rate limiter ───────────────────────────────────────────────────────
app.use(globalLimiter);

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));

// ── Sanitization & pollution protection ───────────────────────────────────────
app.use(mongoSanitize());
app.use(hpp());

// ── Compression ───────────────────────────────────────────────────────────────
app.use(compression());

// ── Request logger ────────────────────────────────────────────────────────────
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.debug(`${req.method} ${req.originalUrl}`, { ip: req.ip });
  next();
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/health", (_req: Request, res: Response) =>
  res.json({ status: "ok", timestamp: new Date().toISOString(), env: env.nodeEnv })
);

// ── API routes ────────────────────────────────────────────────────────────────
app.use("/api", routes);

// ── 404 + error handler ───────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────────────────────
const server = app.listen(env.port, () => {
  logger.info(`🚀 Server → http://localhost:${env.port}  [${env.nodeEnv}]`);
  startAllTasks();
});

// ── Graceful shutdown ─────────────────────────────────────────────────────────
let shuttingDown = false;

const shutdown = (signal: string) => {
  if (shuttingDown) return;
  shuttingDown = true;

  logger.info(`${signal} received — shutting down gracefully`);

  // Force-exit if close/disconnect hangs (e.g. lingering keep-alive sockets)
  const forceExit = setTimeout(() => {
    logger.error("Graceful shutdown timed out — forcing exit");
    process.exit(1);
  }, 10_000);
  forceExit.unref();

  server.close(async (err?: Error) => {
    if (err) {
      logger.error("Error while closing HTTP server", { error: err.message });
      process.exit(1);
    }

    try {
      await prisma.$disconnect();
      logger.info("HTTP server closed, DB disconnected");
      clearTimeout(forceExit);
      process.exit(0);
    } catch (disconnectErr: any) {
      logger.error("Error disconnecting Prisma", { error: disconnectErr.message });
      process.exit(1);
    }
  });
};

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection", { reason });
  shutdown("unhandledRejection");
});

process.on("uncaughtException", (err: Error) => {
  logger.error("Uncaught Exception", { error: err.message, stack: err.stack });
  shutdown("uncaughtException");
});

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));


export default app;
