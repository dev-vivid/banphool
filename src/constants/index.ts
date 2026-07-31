/**
 * Application-wide constants
 */

// ── Roles ─────────────────────────────────────────────────────────────────────
export const ROLES = Object.freeze({
  ADMIN: "ADMIN",
  USER: "USER",
} as const);

// ── Audit Actions ─────────────────────────────────────────────────────────────
export const AUDIT_ACTIONS = Object.freeze({
  REGISTER: "REGISTER",
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  FAILED_LOGIN: "FAILED_LOGIN",
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
} as const);

// ── Audit Status ──────────────────────────────────────────────────────────────
export const AUDIT_STATUS = Object.freeze({
  SUCCESS: "SUCCESS",
  FAILURE: "FAILURE",
} as const);

// ── Pagination ────────────────────────────────────────────────────────────────
export const PAGINATION = Object.freeze({
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const);

// ── Sort Whitelist ────────────────────────────────────────────────────────────
export const PRODUCT_SORT_FIELDS = Object.freeze([
  "name",
  "price",
  "stock",
  "category",
  "createdAt",
] as const);

export const VOLUNTEER_SORT_FIELDS = Object.freeze([
  "firstName",
  "lastName",
  "email",
  "phoneNumber",
  "interestArea",
  "createdAt",
  "updatedAt",
] as const);

export const CONTACT_US_SORT_FIELDS = Object.freeze([
  "name",
  "email",
  "phone",
  "address",
  "remarks",
  "createdAt",
  "updatedAt",
] as const);

export const BENEFICIARY_APPLICATION_SORT_FIELDS = Object.freeze([
  "fullName",
  "fullAddress",
  "emailAddress",
  "phoneNumber",
  "aadharNumber",
  "typeOfAssistance",
  "createdAt",
  "updatedAt",
] as const);

export const NEWS_SORT_FIELDS = Object.freeze([
  "header",
  "description",
  "document",
  "createdAt",
  "updatedAt",
] as const);

export const EVENTS_SORT_FIELDS = Object.freeze([
  "header",
  "description",
  "document",
  "createdAt",
  "updatedAt",
] as const);


export const PHOTOS_SORT_FIELDS = Object.freeze([
  "header",
  "description",
  "document",
  "createdAt",
  "updatedAt",
] as const);


export const VIDEOS_SORT_FIELDS = Object.freeze([
  "header",
  "description",
  "document",
  "createdAt",
  "updatedAt",
] as const);


export const PAYMENT_METHOD = {
  QR: "QR",
  CARD: "CARD",
} as const;

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
} as const;

export const PAYMENT_SORT_FIELDS = Object.freeze([
  "transactionNo",
  "donorName",
  "amount",
  "paymentStatus",
  "createdAt",
]);

// ── HTTP Status Codes ─────────────────────────────────────────────────────────
export const HTTP = Object.freeze({
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
} as const);

// ── Messages ──────────────────────────────────────────────────────────────────
export const MESSAGES = Object.freeze({
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logged out successfully",
  REGISTER_SUCCESS: "Registration successful",
  CREATED: "Created successfully",
  UPDATED: "Updated successfully",
  DELETED: "Deleted successfully",
  NOT_FOUND: "Resource not found",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "You do not have permission for this action",
  INVALID_TOKEN: "Invalid token",
  TOKEN_EXPIRED: "Token expired",
  VALIDATION_FAIL: "Validation failed",
  SERVER_ERROR: "Internal server error",
} as const);

export default {
  ROLES,
  AUDIT_ACTIONS,
  AUDIT_STATUS,
  PAGINATION,
  PRODUCT_SORT_FIELDS,
  VOLUNTEER_SORT_FIELDS,
  NEWS_SORT_FIELDS,
  CONTACT_US_SORT_FIELDS,
  BENEFICIARY_APPLICATION_SORT_FIELDS,
  EVENTS_SORT_FIELDS,
  PHOTOS_SORT_FIELDS,
  VIDEOS_SORT_FIELDS, 
  HTTP,
  MESSAGES,
};

