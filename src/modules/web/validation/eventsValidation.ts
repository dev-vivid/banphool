import { body, param, query } from "express-validator";
import { EVENTS_SORT_FIELDS } from "../../../constants";

export const uuidParam = [
  param("id")
    .isUUID()
    .withMessage("Invalid events ID format"),
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
    .isIn(EVENTS_SORT_FIELDS)
    .withMessage(
      `sortBy must be one of: ${EVENTS_SORT_FIELDS.join(", ")}`
    ),

  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"]),
];

export const eventsBody = [
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

export const createEventsValidation = eventsBody;

export const updateEventsValidation = [
  ...uuidParam,
  ...eventsBody,
];

export const updateVolunteerStatusValidation = [
  ...uuidParam,

  body("isActive")
    .notEmpty()
    .withMessage("isActive is required")
    .isBoolean()
    .withMessage("isActive must be true or false"),
];

export default {
  uuidParam,
  paginationQuery,
  createEventsValidation,
  updateEventsValidation,
  updateVolunteerStatusValidation
};