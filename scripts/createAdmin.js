/**
 * Script: Create an admin user from the command line
 * Usage:  node scripts/createAdmin.js
 */
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, res));

async function main() {
  console.log('\n── Create Admin User ─────────────────────────\n');

  const name     = await ask('Name: ');
  const email    = await ask('Email: ');
  const password = await ask('Password (min 8 chars): ');

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) { console.log('❌ Email already exists'); process.exit(1); }

  const hashed = await bcrypt.hash(password, 12);
  const user   = await prisma.user.create({
    data: { id: uuidv4(), name, email, password: hashed, role: 'ADMIN' },
    select: { id: true, name: true, email: true, role: true },
  });

  console.log('\n✅ Admin created:', user);
  rl.close();
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
