const bcrypt  = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const prisma  = require('../../../config/prisma');
const env     = require('../../../config/env');

const findByEmail = (email) =>
  prisma.user.findUnique({ where: { email } });

const findById = (id) =>
  prisma.user.findUnique({
    where:  { id },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

const createUser = async ({ name, email, password, role = 'USER' }) => {
  const hashed = await bcrypt.hash(password, env.bcryptRounds);
  return prisma.user.create({
    data: { id: uuidv4(), name, email, password: hashed, role },
    select: { id: true, name: true, email: true, role: true },
  });
};

const verifyPassword = (plain, hashed) => bcrypt.compare(plain, hashed);

module.exports = { findByEmail, findById, createUser, verifyPassword };
