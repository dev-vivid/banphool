import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import response from "../shared/utils/response";
import { MESSAGES } from "../constants";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.badRequest(res, MESSAGES.VALIDATION_FAIL, errors.array());
  }
  next();
};

export default validate;
