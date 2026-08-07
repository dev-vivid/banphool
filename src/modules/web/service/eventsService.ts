import prisma from "../../../config/prisma";

interface EventsFindAllOptions {
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
}: EventsFindAllOptions) => {
  const where = search
    ? {
        OR: [
          {
            header: {
              contains: search,
            },
          },
          {
            description: {
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
    prisma.events.count({
      where,
    }),
    prisma.events.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    }),
  ]);

  const baseUrl =
    process.env.BASE_URL || "http://localhost:3000";

  const list = rows.map((item) => ({
    ...item,

    status: item.isActive ? "Active" : "Inactive",

    document: item.document
      ? `${baseUrl}/uploads/events/${item.document}`
      : null,
  }));

  return {
    rows: list,
    total,
  };
};

export const findById = async (id: string) => {
  const events = await prisma.events.findUnique({
    where: {
      id,
    },
  });

  if (!events) {
    return null;
  }

  const baseUrl =
    process.env.BASE_URL || "http://localhost:3000";

  return {
    ...events,

    status: events.isActive ? "Active" : "Inactive",

    document: events.document
      ? `${baseUrl}/uploads/events/${events.document}`
      : null,
  };
};


export const create = async (data: any) => {
  return prisma.events.create({
    data: {
      header: data.header,
      description: data.description,
      document: data.document,
    },
  });
};

export const update = async (id: string, data: any) => {
  const updateData: any = {
    header: data.header,
    description: data.description,
  };

  if (data.document) {
    updateData.document = data.document;
  }

  return prisma.events.update({
    where: {
      id,
    },
    data: updateData,
  });
};

export const remove = async (id: string) => {
  return prisma.events.delete({
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