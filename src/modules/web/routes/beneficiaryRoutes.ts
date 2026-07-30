import { Router } from "express";
import ctrl from "../controller/beneficiaryController";  
import {
  uuidParam,
  paginationQuery,
  createBeneficiaryValidation,
  updateBeneficiaryValidation,
} from "../validation/beneficiaryValidation";  
import validate from "../../../middleware/validate";
import { authenticate, authorize } from "../../../middleware/authMiddleware";
import { ROLES } from "../../../constants";
import { createUploader } from "../../../middleware/upload";

const upload = createUploader("beneficiaryy-applications");

const router = Router();

// GET /api/beneficiary
// Protected
router.get(
  "/",
  authenticate as any,
  paginationQuery,
  validate,
  ctrl.getAll as any
);

// GET /api/beneficiary/:id
// Protected
router.get(
  "/:id",
  authenticate as any,
  uuidParam,
  validate,
  ctrl.getById as any
);

// POST /api/beneficiary
// Public (Website Form)
router.post(
  "/",
  upload.fields([
    { name: "aadharImageUpload", maxCount: 1 },
    { name: "supportDocument", maxCount: 1 },
  ]),
  createBeneficiaryValidation,
  validate,
  ctrl.create as any
);

// PUT /api/beneficiary/:id
// Protected (Admin Only)
router.put(
  "/:id",
  authenticate as any,
  authorize(ROLES.ADMIN) as any,
  upload.fields([
    { name: "aadharImageUpload", maxCount: 1 },
    { name: "supportDocument", maxCount: 1 },
  ]),
  updateBeneficiaryValidation,
  validate,
  ctrl.update as any
);

// DELETE /api/beneficiary/:id
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