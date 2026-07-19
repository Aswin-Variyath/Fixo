import prisma from "./database/prisma";

export async function bootstrap(): Promise<void> {
  try {
    await prisma.$connect();

    console.log("Database connected successfully");
  } catch (error) {
    console.error(
      "Database connection failed:",
      error
    );

    throw error;
  }
}