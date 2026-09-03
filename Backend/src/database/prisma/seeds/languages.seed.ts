import prisma from "../prisma";

export async function seedLanguages() {
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
}