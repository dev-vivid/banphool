const router = require('express').Router();
const { authLimiter } = require('../middleware/rateLimiter');

// ── Register all module routes here ──────────────────────────────────────────
router.use('/auth',     authLimiter, require('../modules/auth/routes/authRoutes'));
router.use('/products',              require('../modules/product/routes/productRoutes'));

// ── Add more modules below:
// router.use('/orders',   require('../modules/order/routes/orderRoutes'));
// router.use('/users',    require('../modules/user/routes/userRoutes'));

module.exports = router;
