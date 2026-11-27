import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { DEFAULT_SERVICES } from "../lib/default-services";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  // One demo account that owns its own sample data.
  const owner = await prisma.user.upsert({
    where: { email: "admin@groomly.test" },
    update: {},
    create: {
      name: "Demo Groomer",
      email: "admin@groomly.test",
      passwordHash: await bcrypt.hash("ChangeMe123!", 12),
      role: "ADMIN",
      services: { create: DEFAULT_SERVICES },
    },
  });

  const hasClient = await prisma.client.findFirst({
    where: { ownerId: owner.id },
  });
  if (!hasClient) {
    await prisma.client.create({
      data: {
        ownerId: owner.id,
        firstName: "Sample",
        lastName: "Client",
        phone: "403-555-0100",
        dogs: {
          create: [{ ownerId: owner.id, name: "Biscuit", breed: "Goldendoodle" }],
        },
      },
    });
  }
  console.log("Seeded demo account:", owner.email);
}

main().finally(() => prisma.$disconnect());
