import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../../middleware/authMiddleware";
import reportUseCase from "../usecase/reportUseCase";
import response from "../../../shared/utils/response";

export const summaryReport = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await reportUseCase.summaryReport();
    return response.success(res, req, data, "Summary report fetched successfully");
  } catch (err) {
    next(err);
  }
};

export const donationReport = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await reportUseCase.donationReport(req.query);
    return response.success(res, req, data, "Donation report fetched successfully");
  } catch (err) {
    next(err);
  }
};

export const paymentReport = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await reportUseCase.paymentReport(req.query);
    return response.success(res, req, data, "Payment report fetched successfully");
  } catch (err) {
    next(err);
  }
};

export const volunteerReport = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await reportUseCase.volunteerReport(req.query);
    return response.success(res, req, data, "Volunteer report fetched successfully");
  } catch (err) {
    next(err);
  }
};

export const beneficiaryReport = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await reportUseCase.beneficiaryReport(req.query);
    return response.success(res, req, data, "Beneficiary report fetched successfully");
  } catch (err) {
    next(err);
  }
};

export const contactReport = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await reportUseCase.contactReport(req.query);
    return response.success(res, req, data, "Contact report fetched successfully");
  } catch (err) {
    next(err);
  }
};

export default {
  summaryReport,
  donationReport,
  paymentReport,
  volunteerReport,
  beneficiaryReport,
  contactReport,
};