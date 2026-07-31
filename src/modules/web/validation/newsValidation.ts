import { body, param, query } from "express-validator";
import { NEWS_SORT_FIELDS } from "../../../constants";

export const uuidParam = [
  param("id")
    .isUUID()
    .withMessage("Invalid news ID format"),
];

export const paginationQuery = [
  query("page")
    .optional()
    .isInt({ min: 1 }),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 }),

  query("search")
    .optional()
    .trim(),

  query("sortBy")
    .optional()
    .isIn(NEWS_SORT_FIELDS)
    .withMessage(
      `sortBy must be one of: ${NEWS_SORT_FIELDS.join(", ")}`
    ),

  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"]),
];

export const newsBody = [
  body("header")
    .trim()
    .notEmpty()
    .withMessage("Header is required")
    .isLength({ max: 255 })
    .withMessage("Header must not exceed 255 characters"),

  body("description")
    .optional({ nullable: true })
    .trim(),
];

export const createNewsValidation = newsBody;

export const updateNewsValidation = [
  ...uuidParam,
  ...newsBody,
];

export default {
  uuidParam,
  paginationQuery,
  createNewsValidation,
  updateNewsValidation,
};