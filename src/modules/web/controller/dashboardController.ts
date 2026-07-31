import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../../middleware/authMiddleware";
import dashboardUseCase from "../usecase/dashboardUseCase";
import response from "../../../shared/utils/response";

export const getDashboard = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await dashboardUseCase.getDashboard();

    return response.success(
      res,
      req,
      data,
      "Dashboard fetched successfully"
    );
  } catch (err) {
    next(err);
  }
};

export const getMonthlyDonations = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await dashboardUseCase.getMonthlyDonations();

    return response.success(
      res,
      req,
      data,
      "Monthly donations fetched successfully"
    );
  } catch (err) {
    next(err);
  }
};

export const getRecentPayments = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await dashboardUseCase.getRecentPayments();

    return response.success(
      res,
      req,
      data,
      "Recent payments fetched successfully"
    );
  } catch (err) {
    next(err);
  }
};

export const getPaymentMethods = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await dashboardUseCase.getPaymentMethods();

    return response.success(
      res,
      req,
      data,
      "Payment methods fetched successfully"
    );
  } catch (err) {
    next(err);
  }
};

export const getPaymentStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await dashboardUseCase.getPaymentStatus();

    return response.success(
      res,
      req,
      data,
      "Payment status fetched successfully"
    );
  } catch (err) {
    next(err);
  }
};

export const getRecentVolunteers = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await dashboardUseCase.getRecentVolunteers();

    return response.success(
      res,
      req,
      data,
      "Recent volunteers fetched successfully"
    );
  } catch (err) {
    next(err);
  }
};

export const getRecentBeneficiaries = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await dashboardUseCase.getRecentBeneficiaries();

    return response.success(
      res,
      req,
      data,
      "Recent beneficiary applications fetched successfully"
    );
  } catch (err) {
    next(err);
  }
};

export const getRecentContacts = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await dashboardUseCase.getRecentContacts();

    return response.success(
      res,
      req,
      data,
      "Recent contact requests fetched successfully"
    );
  } catch (err) {
    next(err);
  }
};

export default {
  getDashboard,
  getMonthlyDonations,
  getRecentPayments,
  getPaymentMethods,
  getPaymentStatus,
  getRecentVolunteers,
  getRecentBeneficiaries,
  getRecentContacts,
};