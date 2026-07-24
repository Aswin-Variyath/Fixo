import prisma from "./database/prisma";
import { redisClient } from "./infrastructure/redis/redis.client";

export async function bootstrap(): Promise<void> {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
    await redisClient.connect()
    console.log("Redis connected successfully")
  } catch (error) {
    console.error("Application Database connections failed:",error);
    throw error;
  }
}