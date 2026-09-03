import prisma from "../prisma";

export async function seedCategories() {
  await prisma.category.createMany({
    data: [
      {
        name: "Electrical",
        slug: "electrical",
        description:
          "Electrical installation, repair and maintenance services.",
        displayOrder: 1,
      },
      {
        name: "Plumbing",
        slug: "plumbing",
        description:
          "Plumbing installation, repair and maintenance services.",
        displayOrder: 2,
      },
      {
        name: "Cleaning",
        slug: "cleaning",
        description:
          "Home and property cleaning services.",
        displayOrder: 3,
      },
      {
        name: "Painting",
        slug: "painting",
        description:
          "Interior and exterior painting services.",
        displayOrder: 4,
      },
      {
        name: "Carpentry",
        slug: "carpentry",
        description:
          "Carpentry, furniture and woodwork services.",
        displayOrder: 5,
      },
      {
        name: "AC & Appliance",
        slug: "ac-appliance",
        description:
          "AC and home appliance installation and repair services.",
        displayOrder: 6,
      },
    ],
    skipDuplicates: true,
  });

  console.log("Categories seeded successfully.");
}