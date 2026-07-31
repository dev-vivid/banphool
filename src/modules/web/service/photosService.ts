import prisma from "../../../config/prisma";

interface PhotosFindAllOptions {
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
}: PhotosFindAllOptions) => {
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
    prisma.photos.count({
      where,
    }),
    prisma.photos.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    }),
  ]);

  const baseUrl = process.env.BASE_URL || "http://localhost:3000";

  const list = rows.map((item) => ({
    ...item,
    document: item.document
      ? `${baseUrl}/uploads/photos/${item.document}`
      : null,
  }));

  return {
    rows: list,
    total,
  };
};

export const findById = async (id: string) => {
  const photos = await prisma.photos.findUnique({
    where: {
      id,
    },
  });

  if (!photos) {
    return null;
  }

  const baseUrl = process.env.BASE_URL || "http://localhost:3000";

  return {
    ...photos,
    document: photos.document
      ? `${baseUrl}/uploads/photos/${photos.document}`
      : null,
  };
};

export const create = async (data: any) => {
  return prisma.photos.create({
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

  return prisma.photos.update({
    where: {
      id,
    },
    data: updateData,
  });
};

export const remove = async (id: string) => {
  return prisma.photos.delete({
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