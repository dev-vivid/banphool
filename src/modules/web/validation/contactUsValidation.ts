import { body, param, query } from "express-validator";
import { CONTACT_US_SORT_FIELDS } from "../../../constants";

export const uuidParam = [
  param("id")
    .isUUID()
    .withMessage("Invalid Contact Us ID format"),
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
    .isIn(CONTACT_US_SORT_FIELDS)
    .withMessage(
      `sortBy must be one of: ${CONTACT_US_SORT_FIELDS.join(", ")}`
    ),

  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"]),
];

export const contactUsBody = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 100 })
    .withMessage("Name must not exceed 100 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .isLength({ max: 150 })
    .withMessage("Email must not exceed 150 characters"),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .isLength({ max: 20 })
    .withMessage("Phone number must not exceed 20 characters"),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required"),

  body("remarks")
    .trim()
    .notEmpty()
    .withMessage("Remarks are required"),

  body("agreeTerms")
    .notEmpty()
    .withMessage("Please accept the terms and conditions")
    .isBoolean()
    .withMessage("agreeTerms must be true or false")
    .custom((value) => {
      if (value !== true && value !== "true") {
        throw new Error("You must accept the terms and conditions");
      }
      return true;
    }),
];

export const createContactUsValidation = contactUsBody;

export const updateContactUsValidation = [
  ...uuidParam,
  ...contactUsBody,
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
  createContactUsValidation,
  updateContactUsValidation,
  updateVolunteerStatusValidation
};