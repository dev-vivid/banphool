import { Router } from "express";
import ctrl from "../controller/volunteerController";
import {
  uuidParam,
  paginationQuery,
  createVolunteerValidation,
  updateVolunteerValidation,
} from "../validation/volunteerValidation";
import validate from "../../../middleware/validate";
import { authenticate, authorize } from "../../../middleware/authMiddleware";
import { ROLES } from "../../../constants";

const router = Router();

// GET /api/volunteer
// Protected
router.get(
  "/",
  authenticate as any,
  paginationQuery,
  validate,
  ctrl.getAll as any
);

// GET /api/volunteer/:id
// Protected
router.get(
  "/:id",
  authenticate as any,
  uuidParam,
  validate,
  ctrl.getById as any
);

// POST /api/volunteer
// Public (Website Form)
router.post(
  "/",
  createVolunteerValidation,
  validate,
  ctrl.create as any
);

// PUT /api/volunteer/:id
// Protected (Admin Only)
router.put(
  "/:id",
  authenticate as any,
  authorize(ROLES.ADMIN) as any,
  updateVolunteerValidation,
  validate,
  ctrl.update as any
);

// DELETE /api/volunteer/:id
// Protected (Admin Only)
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