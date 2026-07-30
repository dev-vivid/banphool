import prisma from "../../../config/prisma";

interface VolunteerFindAllOptions {
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
}: VolunteerFindAllOptions) => {
  const where = search
    ? {
        OR: [
          {
            firstName: {
              contains: search,
            },
          },
          {
            lastName: {
              contains: search,
            },
          },
          {
            email: {
              contains: search,
            },
          },
          {
            phoneNumber: {
              contains: search,
            },
          },
          {
            interestArea: {
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
    prisma.volunteer.count({
      where,
    }),
    prisma.volunteer.findMany({
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
  return prisma.volunteer.findUnique({
    where: {
      id,
    },
  });
};

export const create = async (data: any) => {
  return prisma.volunteer.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      interestArea: data.interestArea,
      remarks: data.remarks,
    },
  });
};

export const update = async (id: string, data: any) => {
  return prisma.volunteer.update({
    where: {
      id,
    },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      interestArea: data.interestArea,
      remarks: data.remarks,
    },
  });
};

export const remove = async (id: string) => {
  return prisma.volunteer.delete({
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
  remove,
};