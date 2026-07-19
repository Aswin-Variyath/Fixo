import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { ZodError } from "zod";

interface AppError extends Error {
  statusCode?: number;
}

export const errorMiddleware = (
  error: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {

  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",

      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });

    return;
  }

  const statusCode = error.statusCode ?? 500;

  res.status(statusCode).json({
    success: false,

    message:
      statusCode === 500
        ? "Internal server error"
        : error.message,
  });
};