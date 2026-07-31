import reportService from "../service/reportService";

export const summaryReport = async () => {
  return await reportService.summaryReport();
};

export const donationReport = async (query: any) => {
  return await reportService.donationReport(query);
};

export const paymentReport = async (query: any) => {
  return await reportService.paymentReport(query);
};

export const volunteerReport = async (query: any) => {
  return await reportService.volunteerReport(query);
};

export const beneficiaryReport = async (query: any) => {
  return await reportService.beneficiaryReport(query);
};

export const contactReport = async (query: any) => {
  return await reportService.contactReport(query);
};

export default {
  summaryReport,
  donationReport,
  paymentReport,
  volunteerReport,
  beneficiaryReport,
  contactReport,
};