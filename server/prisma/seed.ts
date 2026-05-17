import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

// In Prisma 7, explicit config is often safer for standalone scripts
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "file:./dev.db"
    }
  }
} as any);

async function main() {
  console.log('Seeding database...');
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  // 1. Admin
  await prisma.user.upsert({
    where: { email: 'admin@portal.com' },
    update: { password_hash: adminPassword },
    create: {
      email: 'admin@portal.com',
      name: 'System Admin',
      password_hash: adminPassword,
      role: "ADMIN",
      employee_code: 'ADM001',
      department: 'HR',
    },
  });

  // 2. Managers
  const manager1 = await prisma.user.upsert({
    where: { email: 'manager1@portal.com' },
    update: { password_hash: adminPassword },
    create: {
      email: 'manager1@portal.com',
      name: 'Sarah Manager',
      password_hash: adminPassword,
      role: "MANAGER",
      employee_code: 'MGR001',
      department: 'Engineering',
    },
  });

  const manager2 = await prisma.user.upsert({
    where: { email: 'manager2@portal.com' },
    update: { password_hash: adminPassword },
    create: {
      email: 'manager2@portal.com',
      name: 'David Manager',
      password_hash: adminPassword,
      role: "MANAGER",
      employee_code: 'MGR002',
      department: 'Sales',
    },
  });

  // 3. Employees
  const employees = [
    { name: 'John Doe', email: 'employee1@portal.com', manager_id: manager1.id, dept: 'Engineering' },
    { name: 'Alice Smith', email: 'employee2@portal.com', manager_id: manager1.id, dept: 'Engineering' },
    { name: 'Bob Wilson', email: 'employee3@portal.com', manager_id: manager2.id, dept: 'Sales' },
  ];

  for (const emp of employees) {
    await prisma.user.upsert({
      where: { email: emp.email },
      update: { password_hash: adminPassword, manager_id: emp.manager_id },
      create: {
        email: emp.email,
        name: emp.name,
        password_hash: adminPassword,
        role: "EMPLOYEE",
        department: emp.dept,
        manager_id: emp.manager_id,
      },
    });
  }

  // 4. Goal Cycle
  await prisma.goalCycle.upsert({
    where: { id: 'current-cycle' },
    update: { is_active: true },
    create: {
      id: 'current-cycle',
      name: 'FY 2026 Q1',
      quarter: 1,
      start_date: new Date('2026-05-01'),
      end_date: new Date('2026-07-31'),
      is_active: true,
      cycle_type: 'QUARTERLY',
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error('Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
