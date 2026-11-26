import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  await prisma.user.upsert({
    where: { email: "admin@groomly.test" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@groomly.test",
      passwordHash: await bcrypt.hash("ChangeMe123!", 12),
      role: "ADMIN",
    },
  });

  for (const s of [
    { name: "Full groom", basePrice: 85, durationMin: 120 },
    { name: "Bath & brush", basePrice: 50, durationMin: 60 },
    { name: "Nail trim", basePrice: 20, durationMin: 15 },
  ]) {
    await prisma.service.upsert({ where: { name: s.name }, update: {}, create: s });
  }

  const client = await prisma.client.create({
    data: {
      firstName: "Sample",
      lastName: "Client",
      phone: "403-555-0100",
      dogs: { create: [{ name: "Biscuit", breed: "Goldendoodle" }] },
    },
  });
  console.log("Seeded. Sample client:", client.id);
}

main().finally(() => prisma.$disconnect());