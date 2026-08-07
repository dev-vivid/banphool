import { Router } from "express";
import ctrl from "../controller/photosController";
import {
  uuidParam,
  paginationQuery,
  createPhotosValidation,
  updatePhotosValidation,
} from "../validation/photosValidation";
import validate from "../../../middleware/validate";
import { authenticate, authorize } from "../../../middleware/authMiddleware";
import { ROLES } from "../../../constants";
import { createUploader } from "../../../middleware/upload";

const router = Router();

const upload = createUploader("photos");

/**
 * GET /api/photos
 * Public
 */
router.get(
  "/",
  paginationQuery,
  validate,
  ctrl.getAll as any
);

/**
 * GET /api/photos/:id
 * Public
 */
router.get(
  "/:id",
  uuidParam,
  validate,
  ctrl.getById as any
);

/**
 * POST /api/photos
 * Protected (Admin)
 */
router.post(
  "/",
  authenticate as any,
  authorize(ROLES.ADMIN) as any,
  upload.single("document"),
  createPhotosValidation,
  validate,
  ctrl.create as any
);

/**
 * PUT /api/photos/:id
 * Protected (Admin)
 */
router.put(
  "/:id",
  authenticate as any,
  authorize(ROLES.ADMIN) as any,
  upload.single("document"),
  updatePhotosValidation,
  validate,
  ctrl.update as any
);

/**
 * DELETE /api/photos/:id
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

router.patch(
  "/:id/status",
  authenticate as any,
  authorize(ROLES.ADMIN) as any,
  uuidParam,
  validate,
  ctrl.updateStatus as any
);

export default router;
export { router };