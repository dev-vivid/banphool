import prisma from "../../../config/prisma";

interface BeneficiaryApplicationFindAllOptions {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  skip: number;
  limit: number;
}

const baseUrl = process.env.APP_URL || "http://localhost:3000";

const mapFileUrls = (item: any) => ({
  ...item,
  aadharImageUpload: item.aadharImageUpload
    ? `${baseUrl}/uploads/beneficiary-applications/${item.aadharImageUpload}`
    : null,
  supportDocument: item.supportDocument
    ? `${baseUrl}/uploads/beneficiary-applications/${item.supportDocument}`
    : null,
});

export const findAll = async ({
  search,
  sortBy = "createdAt",
  sortOrder = "desc",
  skip,
  limit,
}: BeneficiaryApplicationFindAllOptions) => {
  const where = search
    ? {
        OR: [
          {
            fullName: {
              contains: search,
            },
          },
          {
            emailAddress: {
              contains: search,
            },
          },
          {
            phoneNumber: {
              contains: search,
            },
          },
          {
            aadharNumber: {
              contains: search,
            },
          },
          {
            typeOfAssistance: {
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
    prisma.beneficiaryApplication.count({
      where,
    }),

    prisma.beneficiaryApplication.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    }),
  ]);

  const list = rows.map((item) => ({
    ...mapFileUrls(item),
    status: item.isActive ? "Active" : "Inactive",
  }));

  return {
    total,
    rows: list,
  };
};

export const findById = async (id: string) => {
  const data = await prisma.beneficiaryApplication.findUnique({
    where: {
      id,
    },
  });

  if (!data) {
    return null;
  }

  return {
    ...mapFileUrls(data),
    status: data.isActive ? "Active" : "Inactive",
  };
};


export const create = async (data: any) => {
  return prisma.beneficiaryApplication.create({
    data: {
      fullName: data.fullName,
      fullAddress: data.fullAddress,
      emailAddress: data.emailAddress,
      phoneNumber: data.phoneNumber,
      aadharNumber: data.aadharNumber,
      aadharImageUpload: data.aadharImageUpload,
      typeOfAssistance: data.typeOfAssistance,
      description: data.description,
      supportDocument: data.supportDocument,
    },
  });
};

export const update = async (id: string, data: any) => {
  const updateData: any = {
    fullName: data.fullName,
    fullAddress: data.fullAddress,
    emailAddress: data.emailAddress,
    phoneNumber: data.phoneNumber,
    aadharNumber: data.aadharNumber,
    typeOfAssistance: data.typeOfAssistance,
    description: data.description,
  };

  if (data.aadharImageUpload) {
    updateData.aadharImageUpload = data.aadharImageUpload;
  }

  if (data.supportDocument) {
    updateData.supportDocument = data.supportDocument;
  }

  return prisma.beneficiaryApplication.update({
    where: {
      id,
    },
    data: updateData,
  });
};

export const remove = async (id: string) => {
  return prisma.beneficiaryApplication.delete({
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