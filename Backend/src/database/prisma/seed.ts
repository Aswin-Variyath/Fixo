import prisma from "./prisma";

import {
  seedRoles,
  seedLanguages,
  seedUserStatuses,
  seedCategories,
  seedServices,
  seedTaskers,
} from "./seeds";

async function main() {
  console.log("Seeding database...");

  await seedRoles();
  await seedLanguages();
  await seedUserStatuses();
  await seedCategories();
  await seedServices();
  await seedTaskers();

  console.log("Database seeded successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });