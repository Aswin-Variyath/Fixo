import prisma from "../prisma";

export async function seedRoles() {
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
}