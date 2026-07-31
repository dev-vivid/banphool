import { Router } from "express";
import ctrl from "../controller/videosController";
import {
  uuidParam,
  paginationQuery,
  createVideosValidation,
  updateVideosValidation,
} from "../validation/videosValidation";
import validate from "../../../middleware/validate";
import { authenticate, authorize } from "../../../middleware/authMiddleware";
import { ROLES } from "../../../constants";
import { createUploader } from "../../../middleware/upload";

const router = Router();

const upload = createUploader("videos");

/**
 * GET /api/videos
 * Public
 */
router.get(
  "/",
  paginationQuery,
  validate,
  ctrl.getAll as any
);

/**
 * GET /api/videos/:id
 * Public
 */
router.get(
  "/:id",
  uuidParam,
  validate,
  ctrl.getById as any
);

/**
 * POST /api/videos
 * Protected (Admin)
 */
router.post(
  "/",
  authenticate as any,
  authorize(ROLES.ADMIN) as any,
  upload.single("document"),
  createVideosValidation,
  validate,
  ctrl.create as any
);

/**
 * PUT /api/videos/:id
 * Protected (Admin)
 */
router.put(
  "/:id",
  authenticate as any,
  authorize(ROLES.ADMIN) as any,
  upload.single("document"),
  updateVideosValidation,
  validate,
  ctrl.update as any
);

/**
 * DELETE /api/videos/:id
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