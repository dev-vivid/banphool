import { body, param, query } from "express-validator";
import { BENEFICIARY_APPLICATION_SORT_FIELDS } from "../../../constants";

export const uuidParam = [
  param("id")
    .isUUID()
    .withMessage("Invalid beneficiaryy application ID format"),
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
    .isIn(BENEFICIARY_APPLICATION_SORT_FIELDS)
    .withMessage(
      `sortBy must be one of: ${BENEFICIARY_APPLICATION_SORT_FIELDS.join(", ")}`
    ),

  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"]),
];

export const beneficiaryBody = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ max: 100 })
    .withMessage("Full name must not exceed 100 characters"),

  body("fullAddress")
    .trim()
    .notEmpty()
    .withMessage("Full address is required"),

  body("emailAddress")
    .trim()
    .notEmpty()
    .withMessage("Email address is required")
    .isEmail()
    .withMessage("Invalid email address")
    .isLength({ max: 150 })
    .withMessage("Email address must not exceed 150 characters"),

  body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .isLength({ max: 20 })
    .withMessage("Phone number must not exceed 20 characters"),

  body("aadharNumber")
    .trim()
    .notEmpty()
    .withMessage("Aadhar number is required")
    .isLength({ min: 12, max: 12 })
    .withMessage("Aadhar number must be 12 digits")
    .isNumeric()
    .withMessage("Aadhar number must contain only digits"),

  body("typeOfAssistance")
    .trim()
    .notEmpty()
    .withMessage("Type of assistance is required")
    .isLength({ max: 100 })
    .withMessage("Type of assistance must not exceed 100 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required"),
];

export const createBeneficiaryValidation = beneficiaryBody;

export const updateBeneficiaryValidation = [
  ...uuidParam,
  ...beneficiaryBody,
];

export default {
  uuidParam,
  paginationQuery,
  createBeneficiaryValidation,
  updateBeneficiaryValidation,
};