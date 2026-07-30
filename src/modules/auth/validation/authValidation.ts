import { body } from "express-validator";

export const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 100 }),
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password min 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Password needs at least one uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password needs at least one number"),
  body("role").optional().isIn(["ADMIN", "USER"]).withMessage("Role must be ADMIN or USER"),
];

export const loginValidation = [
  body("email").isEmail().withMessage("Valid email required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

export const refreshValidation = [
  body("refreshToken").notEmpty().withMessage("Refresh token is required"),
];

export default { registerValidation, loginValidation, refreshValidation };
