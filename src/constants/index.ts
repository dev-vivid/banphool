/**
 * Application-wide constants
 */

// ── Roles ─────────────────────────────────────────────────────────────────────
const ROLES = Object.freeze({
  ADMIN: 'ADMIN',
  USER:  'USER',
});

// ── Audit Actions ─────────────────────────────────────────────────────────────
const AUDIT_ACTIONS = Object.freeze({
  REGISTER:     'REGISTER',
  LOGIN:        'LOGIN',
  LOGOUT:       'LOGOUT',
  FAILED_LOGIN: 'FAILED_LOGIN',
  CREATE:       'CREATE',
  UPDATE:       'UPDATE',
  DELETE:       'DELETE',
});

// ── Audit Status ──────────────────────────────────────────────────────────────
const AUDIT_STATUS = Object.freeze({
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
});

// ── Pagination ────────────────────────────────────────────────────────────────
const PAGINATION = Object.freeze({
  DEFAULT_PAGE:  1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT:     100,
});

// ── Sort Whitelist ────────────────────────────────────────────────────────────
const PRODUCT_SORT_FIELDS = Object.freeze(['name', 'price', 'stock', 'category', 'createdAt']);

// ── HTTP Status Codes ─────────────────────────────────────────────────────────
const HTTP = Object.freeze({
  OK:           200,
  CREATED:      201,
  BAD_REQUEST:  400,
  UNAUTHORIZED: 401,
  FORBIDDEN:    403,
  NOT_FOUND:    404,
  CONFLICT:     409,
  SERVER_ERROR: 500,
});

// ── Messages ──────────────────────────────────────────────────────────────────
const MESSAGES = Object.freeze({
  LOGIN_SUCCESS:    'Login successful',
  LOGOUT_SUCCESS:   'Logged out successfully',
  REGISTER_SUCCESS: 'Registration successful',
  CREATED:          'Created successfully',
  UPDATED:          'Updated successfully',
  DELETED:          'Deleted successfully',
  NOT_FOUND:        'Resource not found',
  UNAUTHORIZED:     'Unauthorized',
  FORBIDDEN:        'You do not have permission for this action',
  INVALID_TOKEN:    'Invalid token',
  TOKEN_EXPIRED:    'Token expired',
  VALIDATION_FAIL:  'Validation failed',
  SERVER_ERROR:     'Internal server error',
});

module.exports = {
  ROLES,
  AUDIT_ACTIONS,
  AUDIT_STATUS,
  PAGINATION,
  PRODUCT_SORT_FIELDS,
  HTTP,
  MESSAGES,
};
