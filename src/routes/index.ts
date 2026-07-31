import { Router } from "express";
import { authLimiter } from "../middleware/rateLimiter";
import authRoutes from "../modules/auth/routes/authRoutes";
import volunteerRoutes from "../modules/web/routes/volunteerRoutes";
import beneficiaryRoutes from "../modules/web/routes/beneficiaryRoutes";
import contactUsRoutes from "../modules/web/routes/contactUsRoutes";
import paymentRoutes from "../modules/web/routes/paymentRoutes";    
import newsRoutes from "../modules/web/routes/newsRoutes";  
import eventsRoutes from "../modules/web/routes/eventsRoutes";
import photoRoutes from "../modules/web/routes/photosRoutes";
import videoRoutes from "../modules/web/routes/videosRoutes"; 
import dashboardRoutes from "../modules/web/routes/dashboardRoutes"; 
import reportRoutes from "../modules/web/routes/reportRoutes"; 


const router = Router();

// ── Register all module routes here ──────────────────────────────────────────
router.use("/auth", authLimiter, authRoutes);
router.use("/web/volunteer", volunteerRoutes);
router.use("/web/beneficiary", beneficiaryRoutes);
router.use("/web/contactUs", contactUsRoutes);
router.use("/web/payment", paymentRoutes);

router.use("/web/news", newsRoutes);
router.use("/web/events", eventsRoutes);
router.use("/web/photos", photoRoutes);
router.use("/web/videos", videoRoutes);

router.use("/web/dashboard", dashboardRoutes);
router.use("/web/report", reportRoutes);

export default router;
