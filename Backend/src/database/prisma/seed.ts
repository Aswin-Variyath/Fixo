import bcrypt from "bcrypt";
import prisma from "../prisma";

async function main() {
  console.log("Seeding database...");

  // ==========================================
  // 1. Seed Roles
  // ==========================================

  await prisma.role.createMany({
    data: [
      {
        type: "customer",
        title: "Customer",
        isSuper: false,
      },
      {
        type: "worker",
        title: "Worker",
        isSuper: false,
      },
      {
        type: "super_admin",
        title: "Super Administrator",
        isSuper: true,
      },
    ],
    skipDuplicates: true,
  });

  // ==========================================
  // 2. Seed Languages
  // ==========================================

  await prisma.language.createMany({
    data: [
      {
        type: "en",
        name: "English",
        isDefault: true,
      },
      {
        type: "ml",
        name: "Malayalam",
        isDefault: false,
      },
      {
        type: "hi",
        name: "Hindi",
        isDefault: false,
      },
    ],
    skipDuplicates: true,
  });

  // ==========================================
  // 3. Seed User Statuses
  // ==========================================

  await prisma.userStatus.createMany({
    data: [
      {
        type: "active",
        title: "Active",
        colorCode: "#22C55E",
      },
      {
        type: "suspended",
        title: "Suspended",
        colorCode: "#F59E0B",
      },
      {
        type: "banned",
        title: "Banned",
        colorCode: "#EF4444",
      },
    ],
    skipDuplicates: true,
  });

  // ==========================================
  // 4. Get required master data
  // ==========================================

  const customerRole = await prisma.role.findUnique({
    where: {
      type: "customer",
    },
  });

  const workerRole = await prisma.role.findUnique({
    where: {
      type: "worker",
    },
  });

  const superAdminRole = await prisma.role.findUnique({
    where: {
      type: "super_admin",
    },
  });

  const englishLanguage = await prisma.language.findUnique({
    where: {
      type: "en",
    },
  });

  const malayalamLanguage = await prisma.language.findUnique({
    where: {
      type: "ml",
    },
  });

  const activeStatus = await prisma.userStatus.findUnique({
    where: {
      type: "active",
    },
  });

  // Make sure required seed data exists

  if (
    !customerRole ||
    !workerRole ||
    !superAdminRole ||
    !englishLanguage ||
    !malayalamLanguage ||
    !activeStatus
  ) {
    throw new Error(
      "Required role, language, or user status seed data is missing."
    );
  }

  // ==========================================
  // 5. Hash test password
  // ==========================================

  const hashedPassword = await bcrypt.hash(
    "Test@1234",
    12
  );

  // ==========================================
  // 6. Seed Test Customer
  // ==========================================

  await prisma.user.upsert({
    where: {
      email: "customer@test.com",
    },

    update: {},

    create: {
      firstName: "Test",
      lastName: "Customer",
      email: "customer@test.com",
      phone: "9000000001",
      password: hashedPassword,

      roleId: customerRole.id,
      languageId: englishLanguage.id,
      statusId: activeStatus.id,
    },
  });

  // ==========================================
  // 7. Seed Test Worker
  // ==========================================

  await prisma.user.upsert({
    where: {
      email: "worker@test.com",
    },

    update: {},

    create: {
      firstName: "Test",
      lastName: "Worker",
      email: "worker@test.com",
      phone: "9000000002",
      password: hashedPassword,

      roleId: workerRole.id,
      languageId: malayalamLanguage.id,
      statusId: activeStatus.id,
    },
  });

  // ==========================================
  // 8. Seed Test Super Admin
  // ==========================================

  await prisma.user.upsert({
    where: {
      email: "admin@test.com",
    },

    update: {},

    create: {
      firstName: "Test",
      lastName: "Admin",
      email: "admin@test.com",
      phone: "9000000003",
      password: hashedPassword,

      roleId: superAdminRole.id,
      languageId: englishLanguage.id,
      statusId: activeStatus.id,
    },
  });

  console.log("Database seeded successfully.");
}

main()
  .catch((error) => {
    console.error(
      "Seeding failed:",
      error
    );

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });