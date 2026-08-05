import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import prisma from "../../../config/prisma";
import env from "../../../config/env";

/**
 * Find user by email
 */
export const findByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

/**
 * Find user by ID
 */
export const findById = async (id: string) => {
  return prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

/**
 * Create User
 */
export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
  role?: "ADMIN" | "USER";
}) => {
  const hashedPassword = await bcrypt.hash(
    data.password,
    env.bcryptRounds
  );

  return prisma.user.create({
    data: {
      id: uuidv4(),
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role ?? "USER",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });
};

/**
 * Verify Password
 */
export const verifyPassword = async (
  plainPassword: string,
  hashedPassword: string
) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

export default {
  findByEmail,
  findById,
  createUser,
  verifyPassword,
};