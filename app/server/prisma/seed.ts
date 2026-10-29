import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Seeds demo data so the app is usable immediately after setup:
 *  - one user per role (password: Password123!)
 *  - a few categories, a supplier, and sample products
 */
async function main() {
  const passwordHash = await bcrypt.hash('Password123!', 12);

  const [admin] = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@stockflow.dev' },
      update: {},
      create: { name: 'Admin User', email: 'admin@stockflow.dev', passwordHash, role: 'ADMIN' },
    }),
    prisma.user.upsert({
      where: { email: 'manager@stockflow.dev' },
      update: {},
      create: { name: 'Manager User', email: 'manager@stockflow.dev', passwordHash, role: 'MANAGER' },
    }),
    prisma.user.upsert({
      where: { email: 'staff@stockflow.dev' },
      update: {},
      create: { name: 'Staff User', email: 'staff@stockflow.dev', passwordHash, role: 'STAFF' },
    }),
  ]);

  const electronics = await prisma.category.upsert({
    where: { name: 'Electronics' },
    update: {},
    create: { name: 'Electronics', description: 'Devices and accessories' },
  });
  const stationery = await prisma.category.upsert({
    where: { name: 'Stationery' },
    update: {},
    create: { name: 'Stationery', description: 'Office and school supplies' },
  });

  const supplier = await prisma.supplier.create({
    data: { name: 'Acme Distributors', email: 'sales@acme.example', phone: '+91 90000 00000' },
  });

  const products = [
    { sku: 'ELEC-001', name: 'Wireless Mouse', categoryId: electronics.id, unitPrice: 799, costPrice: 450, quantityInStock: 40, reorderLevel: 10 },
    { sku: 'ELEC-002', name: 'USB-C Charger 65W', categoryId: electronics.id, unitPrice: 1899, costPrice: 1100, quantityInStock: 8, reorderLevel: 10 },
    { sku: 'STAT-001', name: 'A4 Notebook (Pack of 5)', categoryId: stationery.id, unitPrice: 299, costPrice: 160, quantityInStock: 120, reorderLevel: 25 },
    { sku: 'STAT-002', name: 'Gel Pens (Box of 20)', categoryId: stationery.id, unitPrice: 349, costPrice: 190, quantityInStock: 15, reorderLevel: 20 },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: { ...p, supplierId: supplier.id },
    });
  }

  console.log('Seed complete. Login with admin@stockflow.dev / Password123!  (created admin id:', admin.id, ')');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
