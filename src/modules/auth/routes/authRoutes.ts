import { Router } from "express";
import ctrl from "../controller/authController";
import {
  registerValidation,
  loginValidation,
  refreshValidation,
} from "../validation/authValidation";
import { authenticate } from "../../../middleware/authMiddleware";
import validate from "../../../middleware/validate";

const router = Router();

// POST /api/auth/register
router.post("/register", registerValidation, validate, ctrl.register);

// POST /api/auth/login
router.post("/login", loginValidation, validate, ctrl.login);

// POST /api/auth/refresh
router.post("/refresh", refreshValidation, validate, ctrl.refresh);

// POST /api/auth/logout  [protected]
router.post("/logout", authenticate as any, ctrl.logout as any);

// GET  /api/auth/me      [protected]
router.get("/me", authenticate as any, ctrl.me as any);

export default router;
