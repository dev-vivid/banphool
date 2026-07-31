import dashboardService from "../service/dashboardService";

export const getDashboard = async () => {
  return await dashboardService.getDashboard();
};

export const getMonthlyDonations = async () => {
  return await dashboardService.getMonthlyDonations();
};

export const getRecentPayments = async () => {
  return await dashboardService.getRecentPayments();
};

export const getPaymentMethods = async () => {
  return await dashboardService.getPaymentMethods();
};

export const getPaymentStatus = async () => {
  return await dashboardService.getPaymentStatus();
};

export const getRecentVolunteers = async () => {
  return await dashboardService.getRecentVolunteers();
};

export const getRecentBeneficiaries = async () => {
  return await dashboardService.getRecentBeneficiaries();
};

export const getRecentContacts = async () => {
  return await dashboardService.getRecentContacts();
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