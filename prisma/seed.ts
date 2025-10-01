// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const categories = [
    { name: "Medicine", description: "Veterinary medicines and treatments" },
    { name: "Vaccine", description: "Vaccines for pets" },
    { name: "Vitamin", description: "Vitamins and supplements" },
    { name: "Pet Food", description: "Pet food and nutrition" },
    { name: "Accessories", description: "Pet accessories and supplies" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@vetmed.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@vetmed.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Create staff user
  const staffPassword = await bcrypt.hash("staff123", 10);
  await prisma.user.upsert({
    where: { email: "staff@vetmed.com" },
    update: {},
    create: {
      name: "Staff User",
      email: "staff@vetmed.com",
      password: staffPassword,
      role: "STAFF",
    },
  });

  // Create sample suppliers
  const suppliers = [
    {
      name: "VetPharma Supplies",
      contactName: "Dr. Sarah Johnson",
      email: "sarah@vetpharma.com",
      phone: "+1-555-0123",
      address: "123 Medical Street, Health City",
    },
    {
      name: "PetCare Products",
      contactName: "Mike Chen",
      email: "mike@petcare.com",
      phone: "+1-555-0456",
      address: "456 Pet Avenue, Animal Town",
    },
  ];

  for (const supplier of suppliers) {
    await prisma.supplier.upsert({
      where: { name: supplier.name },
      update: {},
      create: supplier,
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
