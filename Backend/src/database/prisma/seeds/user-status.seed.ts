import prisma from "../prisma";

export async function seedUserStatuses() {
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
}