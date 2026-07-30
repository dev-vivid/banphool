/**
 * Prisma Seed Script
 * Run: npm run prisma:seed
 * Creates default admin user + sample products
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // ── Admin user ──────────────────────────────────────────────────────────────
  const existing = await prisma.user.findUnique({ where: { email: 'admin@example.com' } });

  let adminId;
  if (existing) {
    adminId = existing.id;
    console.log('ℹ️  Admin user already exists, skipping.');
  } else {
    const hashed = await bcrypt.hash('Admin@123', 12);
    const admin = await prisma.user.create({
      data: {
        id:       uuidv4(),
        name:     'Super Admin',
        email:    'admin@example.com',
        password: hashed,
        role:     'ADMIN',
      },
    });
    adminId = admin.id;
    console.log('✅ Admin user created — email: admin@example.com  password: Admin@123');
  }

  // ── Sample products ─────────────────────────────────────────────────────────
  const products = [
    { name: 'iPhone 15 Pro',     description: 'Latest Apple smartphone', price: 1199.99, stock: 50,  category: 'Electronics' },
    { name: 'Samsung Galaxy S24',description: 'Samsung flagship phone',  price: 999.99,  stock: 30,  category: 'Electronics' },
    { name: 'Sony WH-1000XM5',   description: 'Noise cancelling headphones', price: 349.99, stock: 100, category: 'Audio' },
    { name: 'MacBook Pro 14"',   description: 'Apple M3 Pro laptop',     price: 1999.99, stock: 20,  category: 'Computers' },
    { name: 'Nike Air Max 270',  description: 'Running shoes',           price: 129.99,  stock: 200, category: 'Footwear' },
  ];

  for (const p of products) {
    const exists = await prisma.product.findFirst({ where: { name: p.name } });
    if (!exists) {
      await prisma.product.create({
        data: { id: uuidv4(), ...p, createdById: adminId },
      });
      console.log(`✅ Product created: ${p.name}`);
    } else {
      console.log(`ℹ️  Product already exists: ${p.name}`);
    }
  }

  console.log('🎉 Seed complete!');
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
