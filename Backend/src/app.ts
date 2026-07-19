import express from "express";

import {
  userRoutes,
} from "./modules/users";

import {
  errorMiddleware,
} from "./shared/middlewares/error.middleware";

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

// API routes
app.use(
  "/api/v1/users",
  userRoutes
);

// Error middleware must be registered after routes
app.use(errorMiddleware);

export default app;