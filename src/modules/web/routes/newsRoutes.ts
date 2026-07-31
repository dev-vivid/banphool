import { Router } from "express";
import ctrl from "../controller/newsController";
import {
  uuidParam,
  paginationQuery,
  createNewsValidation,
  updateNewsValidation,
} from "../validation/newsValidation";
import validate from "../../../middleware/validate";
import { authenticate, authorize } from "../../../middleware/authMiddleware";
import { ROLES } from "../../../constants";
import { createUploader } from "../../../middleware/upload";

const router = Router();

const upload = createUploader("news");

/**
 * GET /api/news
 * Public
 */
router.get(
  "/",
  paginationQuery,
  validate,
  ctrl.getAll as any
);

/**
 * GET /api/news/:id
 * Public
 */
router.get(
  "/:id",
  uuidParam,
  validate,
  ctrl.getById as any
);

/**
 * POST /api/news
 * Protected (Admin)
 */
router.post(
  "/",
  authenticate as any,
  authorize(ROLES.ADMIN) as any,
  upload.single("document"),
  createNewsValidation,
  validate,
  ctrl.create as any
);

/**
 * PUT /api/news/:id
 * Protected (Admin)
 */
router.put(
  "/:id",
  authenticate as any,
  authorize(ROLES.ADMIN) as any,
  upload.single("document"),
  updateNewsValidation,
  validate,
  ctrl.update as any
);

/**
 * DELETE /api/news/:id
 * Protected (Admin)
 */
router.delete(
  "/:id",
  authenticate as any,
  authorize(ROLES.ADMIN) as any,
  uuidParam,
  validate,
  ctrl.remove as any
);

export default router;
export { router };