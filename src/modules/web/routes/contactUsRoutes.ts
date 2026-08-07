import { Router } from "express";
import ctrl from "../controller/contactUsController";
import {
  uuidParam,
  paginationQuery,
  createContactUsValidation,
  updateContactUsValidation,
} from "../validation/contactUsValidation";
import validate from "../../../middleware/validate";
import { authenticate, authorize } from "../../../middleware/authMiddleware";
import { ROLES } from "../../../constants";

const router = Router();

// GET /api/contactUs
// Protected
router.get(
  "/",
  authenticate as any,
  paginationQuery,
  validate,
  ctrl.getAll as any
);

// GET /api/contactUs/:id
// Protected
router.get(
  "/:id",
  authenticate as any,
  uuidParam,
  validate,
  ctrl.getById as any
);

// POST /api/contactUs
// Public (Website Form)
router.post(
  "/",
  createContactUsValidation,
  validate,
  ctrl.create as any
);

// PUT /api/contactUs/:id
// Protected (Admin Only)
router.put(
  "/:id",
  authenticate as any,
  authorize(ROLES.ADMIN) as any,
  updateContactUsValidation,
  validate,
  ctrl.update as any
);

// DELETE /api/contactUs/:id
// Protected (Admin Only)
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