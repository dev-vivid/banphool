import prisma from "../../../config/prisma";
import { parsePagination } from "../../../shared/helpers/pagination";

/**
 * Summary Report
 */
export const summaryReport = async () => {
  const [
    totalDonation,
    totalPayments,
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

    prisma.payment.count(),

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
    totalPayments,
    successPayments,
    pendingPayments,
    failedPayments,
    totalVolunteers,
    totalBeneficiaries,
    totalContacts,
  };
};

/**
 * Donation Report
 */
export const donationReport = async (query: any) => {
  const { page, limit, skip } = parsePagination(query);

  const where: any = {
    paymentStatus: "SUCCESS",
  };

  if (query.search) {
    where.OR = [
      {
        donorName: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        donorEmail: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        donorPhone: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        transactionNo: {
          contains: query.search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (query.fromDate && query.toDate) {
    where.createdAt = {
      gte: new Date(query.fromDate),
      lte: new Date(query.toDate),
    };
  }

  const [total, rows, totalAmount] = await prisma.$transaction([
    prisma.payment.count({
      where,
    }),

    prisma.payment.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),

    prisma.payment.aggregate({
      where,
      _sum: {
        amount: true,
      },
    }),
  ]);

  return {
    total,
    page,
    limit,
    totalAmount: Number(totalAmount._sum.amount ?? 0),
    rows,
  };
};

/**
 * Payment Report
 */
export const paymentReport = async (query: any) => {
  const { page, limit, skip } = parsePagination(query);

  const where: any = {};

  if (query.search) {
    where.OR = [
      {
        donorName: {
          contains: query.search,
        },
      },
      {
        donorEmail: {
          contains: query.search,
        },
      },
      {
        donorPhone: {
          contains: query.search,
        },
      },
      {
        transactionNo: {
          contains: query.search,
        },
      },
    ];
  }

  if (query.paymentStatus) {
    where.paymentStatus = query.paymentStatus;
  }

  if (query.paymentMethod) {
    where.paymentMethod = query.paymentMethod;
  }

  if (query.fromDate && query.toDate) {
    where.createdAt = {
      gte: new Date(query.fromDate),
      lte: new Date(query.toDate),
    };
  }

  const [total, rows] = await prisma.$transaction([
    prisma.payment.count({
      where,
    }),

    prisma.payment.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),
  ]);

  return {
    total,
    page,
    limit,
    rows,
  };
};

/**
 * Volunteer Report
 */
export const volunteerReport = async (query: any) => {
  const { page, limit, skip } = parsePagination(query);

  const where: any = {};

  if (query.search) {
    where.OR = [
      {
        firstName: {
          contains: query.search,
        },
      },
      {
        lastName: {
          contains: query.search,
        },
      },
      {
        email: {
          contains: query.search,
        },
      },
      {
        phoneNumber: {
          contains: query.search,
        },
      },
      {
        interestArea: {
          contains: query.search,
        },
      },
    ];
  }

  if (query.fromDate && query.toDate) {
    where.createdAt = {
      gte: new Date(query.fromDate),
      lte: new Date(query.toDate),
    };
  }

  const [total, rows] = await prisma.$transaction([
    prisma.volunteer.count({
      where,
    }),

    prisma.volunteer.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),
  ]);

  return {
    total,
    page,
    limit,
    rows,
  };
};

export const beneficiaryReport = async (query: any) => {
  const { page, limit, skip } = parsePagination(query);

  const where: any = {};

  if (query.search) {
    where.OR = [
      {
        firstName: {
          contains: query.search,
        },
      },
      {
        lastName: {
          contains: query.search,
        },
      },
      {
        email: {
          contains: query.search,
        },
      },
      {
        phoneNumber: {
          contains: query.search,
        },
      },
    ];
  }

  if (query.fromDate && query.toDate) {
    where.createdAt = {
      gte: new Date(query.fromDate),
      lte: new Date(query.toDate),
    };
  }

  const [total, rows] = await prisma.$transaction([
    prisma.beneficiaryApplication.count({
      where,
    }),

    prisma.beneficiaryApplication.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),
  ]);

  return {
    total,
    page,
    limit,
    rows,
  };
};

export const contactReport = async (query: any) => {
  const { page, limit, skip } = parsePagination(query);

  const where: any = {};

  if (query.search) {
    where.OR = [
      {
        name: {
          contains: query.search,
        },
      },
      {
        email: {
          contains: query.search,
        },
      },
      {
        message: {
          contains: query.search,
        },
      },
    ];
  }

  if (query.fromDate && query.toDate) {
    where.createdAt = {
      gte: new Date(query.fromDate),
      lte: new Date(query.toDate),
    };
  }

  const [total, rows] = await prisma.$transaction([
    prisma.contactUs.count({
      where,
    }),

    prisma.contactUs.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),
  ]);

  return {
    total,
    page,
    limit,
    rows,
  };
};

export default {
  summaryReport,
  donationReport,
  paymentReport,
  volunteerReport,
  beneficiaryReport,
  contactReport,
};