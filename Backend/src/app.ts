import express from "express";

import {
  errorMiddleWare,
} from "./shared/middlewares/error.middleware";
import { userRouter } from "./modules/users";

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Health check


// API routes
app.use(
  "/users",
  userRouter
);

// Error middleware must be registered after routes
app.use(errorMiddleWare);

export default app;