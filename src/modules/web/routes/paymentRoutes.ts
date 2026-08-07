import { Router } from "express";
import ctrl from "../controller/paymentController";
import {
  uuidParam,
 transactionNoParam,
  paginationQuery,
  createPaymentValidation,
  verifyPaymentValidation,
} from "../validation/paymentValidation";
import validate from "../../../middleware/validate";

import { authenticate, authorize } from "../../../middleware/authMiddleware";
import { ROLES } from "../../../constants";

const router = Router();

/**
 * Public
 * Create Payment (Creates Razorpay Order)
 */
router.post(
  "/create",
  createPaymentValidation,
  validate,
  ctrl.create as any
);

/**
 * Public
 * Verify Razorpay Payment
 */
router.post(
  "/verify",
  verifyPaymentValidation,
  validate,
  ctrl.verify as any
);

/**
 * Public
 * Razorpay Webhook
 */
router.post(
  "/webhook",
  ctrl.webhook as any
);

/**
 * Protected
 * View All Payments
 */
router.get(
  "/",
  authenticate as any,
  paginationQuery,
  validate,
  ctrl.getAll as any
);

/**
 * Protected
 * View Payment by ID
 */
router.get(
  "/:id",
  authenticate as any,
  uuidParam,
  validate,
  ctrl.getById as any
);

/**
 * Public
 * Payment Status
 */
router.get(
  "/status/:transactionNo",
  transactionNoParam,
  validate,
  ctrl.getStatus as any
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