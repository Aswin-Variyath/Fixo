import prisma from "../prisma";

async function main() {
  console.log("Seeding database...");

  // Seed Roles
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

  // Seed Languages
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

  console.log("Database seeded successfully.");
}


// Seed user status

await prisma.userStatus.createMany({
  data:[
    {
      type:"ACTIVE",
      title:"Active",
      colorCode:"#22C55E"
    },
    {
      type:'SUSPENDED',
      title:"Suspended",
      colorCode:"#F59E0B"
    },
    {
      type:"BANNED",
      title:"Banned",
      colorCode:"#EF4444"
    }
  ],
  skipDuplicates:true
})

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });