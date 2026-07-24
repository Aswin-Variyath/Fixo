import dotenv from "dotenv";
import { access } from "node:fs";

dotenv.config();

function getRequiredEnv(name:string):string {
  const value = process.env[name]
  if(!value) {
    throw new Error("Missing required environment variable" + name)
  }
  return value 
}

export const ENV = {
  PORT: Number(process.env.PORT ?? 3000),
  DATABASE_URL:getRequiredEnv("DATABASE_URL"),
  REDIS_URL:getRequiredEnv("REDIS_URL"),
  JWT:{
    accessSecret:getRequiredEnv("JWT_ACCESS_SECRET"),
    issuer:process.env.JWT_ISSUER ?? "fixo_app",
    audience:process.env.JWT_AUDIENCE ?? "fixo_web_app",
    accessTokenTtlSeconds:Number(process.env.ACCESS_TOKEN_TTL_SECONDS ?? 900)
  },
  AUTH: {
    refreshTokenTtlSeconds:Number(process.env.REFRESH_TOKEN_TTL_SECONDS ?? 60*60*24*30)
  },
  NODE_ENV:getRequiredEnv("NODE_ENV")
} as const