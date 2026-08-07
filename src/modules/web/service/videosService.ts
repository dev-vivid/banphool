import prisma from "../../../config/prisma";

interface VideosFindAllOptions {
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
}: VideosFindAllOptions) => {
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
    prisma.videos.count({
      where,
    }),
    prisma.videos.findMany({
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
      ? `${baseUrl}/uploads/videos/${item.document}`
      : null,
  }));

  return {
    rows: list,
    total,
  };
};

export const findById = async (id: string) => {
  const videos = await prisma.videos.findUnique({
    where: {
      id,
    },
  });

  if (!videos) {
    return null;
  }

  const baseUrl =
    process.env.BASE_URL || "http://localhost:3000";

  return {
    ...videos,

    status: videos.isActive ? "Active" : "Inactive",

    document: videos.document
      ? `${baseUrl}/uploads/videos/${videos.document}`
      : null,
  };
};

export const create = async (data: any) => {
  return prisma.videos.create({
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

  return prisma.videos.update({
    where: {
      id,
    },
    data: updateData,
  });
};

export const remove = async (id: string) => {
  return prisma.videos.delete({
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