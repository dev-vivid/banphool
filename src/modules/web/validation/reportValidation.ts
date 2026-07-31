import { query } from "express-validator";

/**
 * Common Pagination Validation
 */
export const paginationQuery = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be greater than 0"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("search")
    .optional()
    .trim(),

  query("sortBy")
    .optional()
    .trim(),

  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("sortOrder must be asc or desc"),
];

/**
 * Date Range Validation
 * Format: YYYY-MM-DD
 */
export const dateRangeValidation = [
  query("fromDate")
    .optional()
    .isISO8601()
    .withMessage("fromDate must be in YYYY-MM-DD format"),

  query("toDate")
    .optional()
    .isISO8601()
    .withMessage("toDate must be in YYYY-MM-DD format"),
];

export default {
  paginationQuery,
  dateRangeValidation,
};