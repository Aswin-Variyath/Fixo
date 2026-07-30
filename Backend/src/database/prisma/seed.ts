import prisma from "./prisma";

import {seedRoles, seedLanguages, seedUserStatuses,} from "./seeds";

async function main() {
  console.log("Seeding database...");

  await seedRoles();
  await seedLanguages();
  await seedUserStatuses();

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