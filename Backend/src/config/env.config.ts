import dotenv from "dotenv";
import { getNumberEnv, getOptionalEnv, getRequiredEnv } from "./helpers/env.helper";
dotenv.config();



export const ENV = {
  APP: {
    PORT: getNumberEnv("PORT",3000),
    NODE_ENV: getRequiredEnv("NODE_ENV"),
    FRONTEND_URL: getRequiredEnv("FRONTEND_URL")
  },
  DATABASE: {
    URL: getRequiredEnv("DATABASE_URL")
  },
  REDIS: {
    URL: getRequiredEnv("REDIS_URL")
  },
  AUTH: {
    JWT: {
      ACCESS_SECRET: getRequiredEnv("JWT_ACCESS_SECRET"),
      ISSUER: getOptionalEnv("JWT_ISSUER", "fixo_app"),
      AUDIENCE: getOptionalEnv("JWT_AUDIENCE", "fixo_web_app")
    },
    TOKEN: {
      ACCESS_TTL_SECONDS:getNumberEnv("ACCESS_TOKEN_TTL_SECONDS", 900),
      REFRESH_TTL_SECONDS:getNumberEnv("REFRESH_TOKEN_TTL_SECONDS",60 * 60 * 24 * 30)
    }
  },
  MAIL: {
    SMTP: {
      HOST:getRequiredEnv("SMTP_HOST"),
      PORT:getNumberEnv("SMTP_PORT", 587),
      USER:getRequiredEnv("SMTP_USER"),
      PASS:getRequiredEnv("SMTP_PASS"),
    },
    FROM:getRequiredEnv("MAIL_FROM")
  }
} as const