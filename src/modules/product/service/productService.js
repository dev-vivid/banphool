const { v4: uuidv4 } = require('uuid');
const prisma = require('../../../config/prisma');

const includeUsers = {
  createdBy: { select: { id: true, name: true } },
  updatedBy: { select: { id: true, name: true } },
};

const findAll = async ({ search, category, sortBy, sortOrder, skip, limit }) => {
  const where = {
    isActive: true,
    ...(search   && { OR: [{ name: { contains: search } }, { description: { contains: search } }] }),
    ...(category && { category }),
  };

  const orderBy = { [sortBy || 'createdAt']: sortOrder || 'desc' };

  const [total, rows] = await prisma.$transaction([
    prisma.product.count({ where }),
    prisma.product.findMany({ where, include: includeUsers, orderBy, skip, take: limit }),
  ]);

  return { rows, total };
};

const findById = (id) =>
  prisma.product.findFirst({ where: { id, isActive: true }, include: includeUsers });

const create = async (data, userId) => {
  return prisma.product.create({
    data: { id: uuidv4(), ...data, createdById: userId },
    include: includeUsers,
  });
};

const update = async (id, data, userId) => {
  return prisma.product.update({
    where: { id },
    data:  { ...data, updatedById: userId },
    include: includeUsers,
  });
};

const softDelete = (id, userId) =>
  prisma.product.update({
    where: { id },
    data:  { isActive: false, updatedById: userId },
  });

module.exports = { findAll, findById, create, update, softDelete };
