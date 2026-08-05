import { Router } from "express";
import authController from "../controller/authController";
import {
  registerValidation,
  loginValidation,
  refreshValidation,
} from "../validation/authValidation";
import validate from "../../../middleware/validate";
import { authenticate } from "../../../middleware/authMiddleware";

const router = Router();

/**
 * Register
 * POST /api/auth/register
 */
router.post(
  "/register",
  registerValidation,
  validate,
  authController.register
);

/**
 * Login
 * POST /api/auth/login
 */
router.post(
  "/login",
  loginValidation,
  validate,
  authController.login
);

/**
 * Refresh Token
 * POST /api/auth/refresh
 */
router.post(
  "/refresh",
  refreshValidation,
  validate,
  authController.refresh
);

/**
 * Logout
 * POST /api/auth/logout
 */
router.post(
  "/logout",
  authenticate as any,
  authController.logout
);

/**
 * Current Logged-in User
 * GET /api/auth/me
 */
router.get(
  "/me",
  authenticate as any,
  authController.me
);

export default router;
export { router };