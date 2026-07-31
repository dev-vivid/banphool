import { Router } from "express";
import ctrl from "../controller/reportController";
import validate from "../../../middleware/validate";
import { authenticate, authorize } from "../../../middleware/authMiddleware";
import { ROLES } from "../../../constants";
import {
  dateRangeValidation,
  paginationQuery,
} from "../validation/reportValidation";

const router = Router();

/**
 * All reports require login
 */
router.use(authenticate as any);

/**
 * Donation Summary
 */
router.get(
  "/donations",
  authorize(ROLES.ADMIN) as any,
  dateRangeValidation,
  validate,
  ctrl.donationReport as any
);

/**
 * Payment Report
 */
router.get(
  "/payments",
  authorize(ROLES.ADMIN) as any,
  paginationQuery,
  validate,
  ctrl.paymentReport as any
);

/**
 * Volunteer Report
 */
router.get(
  "/volunteers",
  authorize(ROLES.ADMIN) as any,
  paginationQuery,
  validate,
  ctrl.volunteerReport as any
);

/**
 * Beneficiary Report
 */
router.get(
  "/beneficiaries",
  authorize(ROLES.ADMIN) as any,
  paginationQuery,
  validate,
  ctrl.beneficiaryReport as any
);

/**
 * Contact Us Report
 */
router.get(
  "/contacts",
  authorize(ROLES.ADMIN) as any,
  paginationQuery,
  validate,
  ctrl.contactReport as any
);

/**
 * Dashboard Summary Report
 */
router.get(
  "/summary",
  authorize(ROLES.ADMIN) as any,
  ctrl.summaryReport as any
);

export default router;
export { router };