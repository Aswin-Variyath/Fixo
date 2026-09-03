import prisma from "../prisma";

export async function seedRoles() {
  await prisma.role.createMany({
    data: [
      {
        type: "customer",
        title: "Customer",
        isSuperAdmin: false,
      },
      {
        type: "tasker",
        title: "Tasker",
        isSuperAdmin: false,
      },
      {
        type: "super_admin",
        title: "Super Administrator",
        isSuperAdmin: true,
      },
    ],
    skipDuplicates: true,
  });
}