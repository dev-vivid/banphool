import { Router } from "express";
import ctrl from "../controller/eventsController";
import {
  uuidParam,
  paginationQuery,
  createEventsValidation,
  updateEventsValidation,
} from "../validation/eventsValidation";
import validate from "../../../middleware/validate";
import { authenticate, authorize } from "../../../middleware/authMiddleware";
import { ROLES } from "../../../constants";
import { createUploader } from "../../../middleware/upload";

const router = Router();

const upload = createUploader("events");

/**
 * GET /api/events
 * Public
 */
router.get(
  "/",
  paginationQuery,
  validate,
  ctrl.getAll as any
);

/**
 * GET /api/events/:id
 * Public
 */
router.get(
  "/:id",
  uuidParam,
  validate,
  ctrl.getById as any
);

/**
 * POST /api/events
 * Protected (Admin)
 */
router.post(
  "/",
  authenticate as any,
  authorize(ROLES.ADMIN) as any,
  upload.single("document"),
  createEventsValidation,
  validate,
  ctrl.create as any
);

/**
 * PUT /api/events/:id
 * Protected (Admin)
 */
router.put(
  "/:id",
  authenticate as any,
  authorize(ROLES.ADMIN) as any,
  upload.single("document"),
  updateEventsValidation,
  validate,
  ctrl.update as any
);

/**
 * DELETE /api/events/:id
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