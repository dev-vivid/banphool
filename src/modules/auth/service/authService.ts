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

/**
 * Rehash a user's password in the background if it was hashed with an
 * outdated (slower) cost factor than the current configured rounds.
 * Never throws — this is a best-effort upgrade, not part of the login flow.
 */
export const rehashPasswordIfNeeded = async (
  userId: string,
  plainPassword: string,
  hashedPassword: string
) => {
  try {
    if (bcrypt.getRounds(hashedPassword) <= env.bcryptRounds) return;

    const newHash = await bcrypt.hash(plainPassword, env.bcryptRounds);
    await prisma.user.update({
      where: { id: userId },
      data: { password: newHash },
    });
  } catch {
    // best-effort — a failed rehash just means it'll be retried next login
  }
};

export default {
  findByEmail,
  findById,
  createUser,
  verifyPassword,
  rehashPasswordIfNeeded,
};