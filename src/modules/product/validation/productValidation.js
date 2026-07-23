const { body, param, query } = require('express-validator');
const { PRODUCT_SORT_FIELDS } = require('../../../constants');

const uuidParam = [
  param('id').isUUID().withMessage('Invalid product ID format'),
];

const paginationQuery = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('sortBy').optional().isIn(PRODUCT_SORT_FIELDS).withMessage(`sortBy must be one of: ${PRODUCT_SORT_FIELDS.join(', ')}`),
  query('sortOrder').optional().isIn(['asc', 'desc']),
];

const productBody = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 200 }),
  body('description').optional().trim(),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be non-negative'),
  body('category').optional().trim().isLength({ max: 100 }),
];

const createProductValidation = productBody;
const updateProductValidation = [...uuidParam, ...productBody];

module.exports = { uuidParam, paginationQuery, createProductValidation, updateProductValidation };
