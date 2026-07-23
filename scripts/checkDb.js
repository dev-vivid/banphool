/**
 * Script: Check database connection and show table counts
 * Usage:  node scripts/checkDb.js
 */
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('\n── Database Health Check ─────────────────────\n');
  await prisma.$connect();
  console.log('✅ Connected to database\n');

  const [users, products, auditLogs, refreshTokens] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.auditLog.count(),
    prisma.refreshToken.count(),
  ]);

  console.table({ users, products, auditLogs, refreshTokens });
  await prisma.$disconnect();
}

main().catch((e) => { console.error('❌', e.message); process.exit(1); });
