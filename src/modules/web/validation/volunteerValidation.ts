import { body, param, query } from "express-validator";
import { VOLUNTEER_SORT_FIELDS } from "../../../constants";

export const uuidParam = [
  param("id")
    .isUUID()
    .withMessage("Invalid volunteer ID format"),
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
    .isIn(VOLUNTEER_SORT_FIELDS)
    .withMessage(
      `sortBy must be one of: ${VOLUNTEER_SORT_FIELDS.join(", ")}`
    ),

  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"]),
];

export const volunteerBody = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ max: 100 })
    .withMessage("First name must not exceed 100 characters"),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ max: 100 })
    .withMessage("Last name must not exceed 100 characters"),

  body("email")
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage("Invalid email address")
    .isLength({ max: 150 })
    .withMessage("Email must not exceed 150 characters"),

  body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .isLength({ max: 20 })
    .withMessage("Phone number must not exceed 20 characters"),

  body("interestArea")
    .trim()
    .notEmpty()
    .withMessage("Interest area is required")
    .isLength({ max: 200 })
    .withMessage("Interest area must not exceed 200 characters"),

  body("address")
    .optional({ nullable: true })
    .trim(),

  body("remarks")
    .optional({ nullable: true })
    .trim(),
];

export const createVolunteerValidation = volunteerBody;

export const updateVolunteerValidation = [
  ...uuidParam,
  ...volunteerBody,
];

export default {
  uuidParam,
  paginationQuery,
  createVolunteerValidation,
  updateVolunteerValidation,
};