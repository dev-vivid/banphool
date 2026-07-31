import { Router } from "express";
import ctrl from "../controller/dashboardController";
import { authenticate, authorize } from "../../../middleware/authMiddleware";
import { ROLES } from "../../../constants";

const router = Router();

/**
 * All Dashboard APIs
 * Admin Only
 */
router.use(authenticate as any);
router.use(authorize(ROLES.ADMIN) as any);

/**
 * Dashboard Summary Cards
 */
router.get(
  "/",
  ctrl.getDashboard as any
);

/**
 * Monthly Donation Chart
 */
router.get(
  "/monthly",
  ctrl.getMonthlyDonations as any
);

/**
 * Recent Payments
 */
router.get(
  "/recent-payments",
  ctrl.getRecentPayments as any
);

/**
 * Payment Method Chart
 */
router.get(
  "/payment-methods",
  ctrl.getPaymentMethods as any
);

/**
 * Payment Status Chart
 */
router.get(
  "/payment-status",
  ctrl.getPaymentStatus as any
);

/**
 * Recent Volunteers
 */
router.get(
  "/recent-volunteers",
  ctrl.getRecentVolunteers as any
);

/**
 * Recent Beneficiaries
 */
router.get(
  "/recent-beneficiaries",
  ctrl.getRecentBeneficiaries as any
);

/**
 * Recent Contact Us
 */
router.get(
  "/recent-contacts",
  ctrl.getRecentContacts as any
);

export default router;
export { router };