import prisma from "../../../config/prisma";

interface NewsFindAllOptions {
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
}: NewsFindAllOptions) => {
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
    prisma.news.count({
      where,
    }),
    prisma.news.findMany({
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
      ? `${baseUrl}/uploads/news/${item.document}`
      : null,
  }));

  return {
    rows: list,
    total,
  };
};

export const findById = async (id: string) => {
  const news = await prisma.news.findUnique({
    where: {
      id,
    },
  });

  if (!news) {
    return null;
  }

  const baseUrl = process.env.BASE_URL || "http://localhost:3000";

  return {
    ...news,
    document: news.document
      ? `${baseUrl}/uploads/news/${news.document}`
      : null,
  };
};

export const create = async (data: any) => {
  return prisma.news.create({
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

  return prisma.news.update({
    where: {
      id,
    },
    data: updateData,
  });
};

export const remove = async (id: string) => {
  return prisma.news.delete({
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