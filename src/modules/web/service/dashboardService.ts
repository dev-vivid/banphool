import prisma from "../../../config/prisma";

/**
 * Dashboard Summary
 */
export const getDashboard = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const [
    totalDonation,
    todayDonation,
    monthDonation,
    successPayments,
    pendingPayments,
    failedPayments,
    totalVolunteers,
    totalBeneficiaries,
    totalContacts,
  ] = await Promise.all([
    prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        paymentStatus: "SUCCESS",
      },
    }),

    prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        paymentStatus: "SUCCESS",
        createdAt: {
          gte: today,
        },
      },
    }),

    prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        paymentStatus: "SUCCESS",
        createdAt: {
          gte: monthStart,
        },
      },
    }),

    prisma.payment.count({
      where: {
        paymentStatus: "SUCCESS",
      },
    }),

    prisma.payment.count({
      where: {
        paymentStatus: "PENDING",
      },
    }),

    prisma.payment.count({
      where: {
        paymentStatus: "FAILED",
      },
    }),

    prisma.volunteer.count(),

    prisma.beneficiaryApplication.count(),

    prisma.contactUs.count(),
  ]);

  return {
    totalDonation: Number(totalDonation._sum.amount ?? 0),
    todayDonation: Number(todayDonation._sum.amount ?? 0),
    monthDonation: Number(monthDonation._sum.amount ?? 0),

    successPayments,
    pendingPayments,
    failedPayments,

    totalVolunteers,
    totalBeneficiaries,
    totalContacts,
  };
};

/**
 * Monthly Donation Chart
 */
export const getMonthlyDonations = async () => {
  const currentYear = new Date().getFullYear();

  const payments = await prisma.payment.findMany({
    where: {
      paymentStatus: "SUCCESS",
      createdAt: {
        gte: new Date(currentYear, 0, 1),
        lt: new Date(currentYear + 1, 0, 1),
      },
    },
    select: {
      amount: true,
      createdAt: true,
    },
  });

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const result = months.map((month) => ({
    month,
    amount: 0,
  }));

  payments.forEach((payment) => {
    const monthIndex = payment.createdAt.getMonth();
    result[monthIndex].amount += Number(payment.amount);
  });

  return result;
};

/**
 * Recent Payments
 */
export const getRecentPayments = async () => {
  return await prisma.payment.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
    select: {
      id: true,
      transactionNo: true,
      donorName: true,
      donorEmail: true,
      donorPhone: true,
      amount: true,
      paymentMethod: true,
      paymentStatus: true,
      gatewayPaymentId: true,
      createdAt: true,
    },
  });
};

/**
 * Payment Method Summary
 */
export const getPaymentMethods = async () => {
  const result = await prisma.payment.groupBy({
    by: ["paymentMethod"],
    _count: {
      paymentMethod: true,
    },
  });

  return result.map((item) => ({
    paymentMethod: item.paymentMethod,
    total: item._count.paymentMethod,
  }));
};

/**
 * Payment Status Summary
 */
export const getPaymentStatus = async () => {
  const result = await prisma.payment.groupBy({
    by: ["paymentStatus"],
    _count: {
      paymentStatus: true,
    },
  });

  return result.map((item) => ({
    paymentStatus: item.paymentStatus,
    total: item._count.paymentStatus,
  }));
};

/**
 * Recent Volunteers
 */
export const getRecentVolunteers = async () => {
  return await prisma.volunteer.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      interestArea: true,
      createdAt: true,
    },
  });
};

/**
 * Recent Beneficiary Applications
 */
export const getRecentBeneficiaries = async () => {
  return await prisma.beneficiaryApplication.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
    select: {
      id: true,
      fullName: true,
      emailAddress: true,
      phoneNumber: true,
      typeOfAssistance: true,
      createdAt: true,
    },
  });
};

/**
 * Recent Contact Us
 */
export const getRecentContacts = async () => {
  return await prisma.contactUs.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      createdAt: true,
    },
  });
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