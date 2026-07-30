import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import prisma from "../../../config/prisma";
import env from "../../../config/env";

export const findByEmail = (email: string) =>
  prisma.user.findUnique({ where: { email } });

export const findById = (id: string) =>
  prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

export const createUser = async ({ name, email, password, role = "USER" }: any) => {
  const hashed = await bcrypt.hash(password, env.bcryptRounds);
  return prisma.user.create({
    data: { id: uuidv4(), name, email, password: hashed, role },
    select: { id: true, name: true, email: true, role: true },
  });
};

export const verifyPassword = (plain: string, hashed: string) =>
  bcrypt.compare(plain, hashed);

export default { findByEmail, findById, createUser, verifyPassword };
