import prisma from "../../../config/prisma";

interface ContactUsFindAllOptions {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  skip: number;
  limit: number;
}

export const findAll = async ({
  search,
  sortBy = "createdAt",
  sortOrder = "desc",
  skip,
  limit,
}: ContactUsFindAllOptions) => {
  const where = search
    ? {
        OR: [
          {
            name: {
              contains: search,
            },
          },
          {
            email: {
              contains: search,
            },
          },
          {
            phone: {
              contains: search,
            },
          },
          {
            address: {
              contains: search,
            },
          },
          {
            remarks: {
              contains: search,
            },
          },
        ],
      }
    : {};

  const orderBy = {
    [sortBy]: sortOrder,
  };

  const [total, rows] = await prisma.$transaction([
    prisma.contactUs.count({
      where,
    }),

    prisma.contactUs.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    }),
  ]);

  return {
    rows,
    total,
  };
};

export const findById = async (id: string) => {
  return prisma.contactUs.findUnique({
    where: {
      id,
    },
  });
};

export const create = async (data: any) => {
  return prisma.contactUs.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      remarks: data.remarks,
      agreeTerms: data.agreeTerms,

      emailSent: false,
      emailStatus: "PENDING",
    },
  });
};

export const update = async (
  id: string,
  data: any
) => {
  return prisma.contactUs.update({
    where: {
      id,
    },
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      remarks: data.remarks,
      agreeTerms: data.agreeTerms,
    },
  });
};

export const updateEmailStatus = async (
  id: string,
  emailSent: boolean,
  emailStatus: string,
  emailError?: string
) => {
  return prisma.contactUs.update({
    where: {
      id,
    },
    data: {
      emailSent,
      emailStatus,
      emailSentAt: emailSent ? new Date() : null,
      emailError: emailError ?? null,
    },
  });
};

export const remove = async (id: string) => {
  return prisma.contactUs.delete({
    where: {
      id,
    },
  });
};

export default {
  findAll,
 findById,
  create,
  update,
  updateEmailStatus,
  remove,
};