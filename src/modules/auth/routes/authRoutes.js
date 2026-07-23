const router   = require('express').Router();
const ctrl     = require('../controller/authController');
const { registerValidation, loginValidation, refreshValidation } = require('../validation/authValidation');
const { authenticate } = require('../../../middleware/authMiddleware');
const validate = require('../../../middleware/validate');

// POST /api/auth/register
router.post('/register', registerValidation, validate, ctrl.register);

// POST /api/auth/login
router.post('/login', loginValidation, validate, ctrl.login);

// POST /api/auth/refresh
router.post('/refresh', refreshValidation, validate, ctrl.refresh);

// POST /api/auth/logout  [protected]
router.post('/logout', authenticate, ctrl.logout);

// GET  /api/auth/me      [protected]
router.get('/me', authenticate, ctrl.me);

module.exports = router;
