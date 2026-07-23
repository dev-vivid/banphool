const router = require('express').Router();
const ctrl   = require('../controller/productController');
const { uuidParam, paginationQuery, createProductValidation, updateProductValidation } = require('../validation/productValidation');
const { authenticate, authorize } = require('../../../middleware/authMiddleware');
const validate = require('../../../middleware/validate');
const { ROLES } = require('../../../constants');

router.use(authenticate);

// GET  /api/products
router.get('/',    paginationQuery,           validate, ctrl.getAll);
// GET  /api/products/:id
router.get('/:id', uuidParam,                 validate, ctrl.getById);
// POST /api/products
router.post('/',   authorize(ROLES.ADMIN), createProductValidation, validate, ctrl.create);
// PUT  /api/products/:id
router.put('/:id', authorize(ROLES.ADMIN), updateProductValidation, validate, ctrl.update);
// DELETE /api/products/:id
router.delete('/:id', authorize(ROLES.ADMIN), uuidParam, validate, ctrl.remove);

module.exports = router;

 