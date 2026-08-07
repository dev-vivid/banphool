import { body, param, query } from "express-validator";
import {
  PAYMENT_SORT_FIELDS,
  PAYMENT_METHOD,
} from "../../../constants";

export const uuidParam = [
  param("id")
    .isUUID()
    .withMessage("Invalid payment ID format"),
];

export const transactionNoParam = [
  param("transactionNo")
    .trim()
    .notEmpty()
    .withMessage("Transaction number is required"),
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
    .isIn(PAYMENT_SORT_FIELDS)
    .withMessage(
      `sortBy must be one of: ${PAYMENT_SORT_FIELDS.join(", ")}`
    ),

  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"]),
];

export const paymentBody = [
  body("donorName")
    .trim()
    .notEmpty()
    .withMessage("Donor name is required")
    .isLength({ max: 100 })
    .withMessage("Donor name must not exceed 100 characters"),

  body("donorEmail")
    .optional({ nullable: true })
    .trim()
    .isEmail()
    .withMessage("Invalid email address")
    .isLength({ max: 150 })
    .withMessage("Email must not exceed 150 characters"),

  body("donorPhone")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 20 })
    .withMessage("Phone number must not exceed 20 characters"),

  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be greater than 0"),

  body("paymentMethod")
    .notEmpty()
    .withMessage("Payment method is required")
    .isIn([
      PAYMENT_METHOD.QR,
      PAYMENT_METHOD.CARD,
    ])
    .withMessage("Invalid payment method"),

  body("remarks")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage("Remarks must not exceed 500 characters"),
];

export const verifyPaymentValidation = [
  body("transactionNo")
    .trim()
    .notEmpty()
    .withMessage("Transaction number is required"),

  body("razorpay_order_id")
    .trim()
    .notEmpty()
    .withMessage("Razorpay Order ID is required"),

  body("razorpay_payment_id")
    .trim()
    .notEmpty()
    .withMessage("Razorpay Payment ID is required"),

  body("razorpay_signature")
    .trim()
    .notEmpty()
    .withMessage("Razorpay Signature is required"),
];

export const createPaymentValidation = paymentBody;

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
  transactionNoParam,
  paginationQuery,
  createPaymentValidation,
  verifyPaymentValidation,
};