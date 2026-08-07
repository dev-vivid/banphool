import prisma from "../../../config/prisma";

interface VolunteerFindAllOptions {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  skip: number;
  limit: number;
}

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
          {
            address: {
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

  const formattedRows = rows.map((volunteer) => ({
    ...volunteer,
    status: volunteer.isActive ? "Active" : "Inactive",
  }));

  return {
    rows: formattedRows,
    total,
  };
};

export const findById = async (id: string) => {
  const volunteer = await prisma.volunteer.findUnique({
    where: {
      id,
    },
  });

  if (!volunteer) {
    return null;
  }

  return {
    ...volunteer,
    status: volunteer.isActive ? "Active" : "Inactive",
  };
};


export const create = async (data: any) => {
  return prisma.volunteer.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email || null,
      phoneNumber: data.phoneNumber,
      interestArea: data.interestArea,
      address: data.address || null,
      remarks: data.remarks || null,
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
      email: data.email || null,
      phoneNumber: data.phoneNumber,
      interestArea: data.interestArea,
      address: data.address || null,
      remarks: data.remarks || null,
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


export const updateStatus = async (
  id: string,
  isActive: boolean
) => {
  return prisma.volunteer.update({
    where: {
      id,
    },
    data: {
      isActive,
    },
  });
};

export default {
  findAll,
  findById,
  create,
  update,
  remove,
  updateStatus
};