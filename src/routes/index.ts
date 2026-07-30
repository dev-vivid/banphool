import { Router } from "express";
import { authLimiter } from "../middleware/rateLimiter";
import authRoutes from "../modules/auth/routes/authRoutes";
import volunteerRoutes from "../modules/web/routes/volunteerRoutes";
import beneficiaryRoutes from "../modules/web/routes/beneficiaryRoutes";
import contactUsRoutes from "../modules/web/routes/contactUsRoutes";
import paymentRoutes from "../modules/web/routes/paymentRoutes";    


const router = Router();

// ── Register all module routes here ──────────────────────────────────────────
router.use("/auth", authLimiter, authRoutes);
router.use("/web/volunteer", volunteerRoutes);
router.use("/web/beneficiary", beneficiaryRoutes);
router.use("/web/contactUs", contactUsRoutes);
router.use("/web/payment", paymentRoutes);

export default router;
