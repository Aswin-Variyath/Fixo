import { ErrorRequestHandler } from "express";
import { AppError } from "../errors/app.error";
import { StatusCodes } from "http-status-codes";

export const errorMiddleware: ErrorRequestHandler = (
    error,
    _req,
    res,
    _next
) => {
    if (error instanceof AppError) {
        const response: {
            success: boolean;
            message: string;
            code?: string;
            details?: unknown;
        } = {
            success: false,
            message: error.message,
        };

        if (error.code !== undefined) {
            response.code = error.code;
        }

        if (error.details !== undefined) {
            response.details = error.details;
        }

        res.status(error.statusCode).json(response);
        return;
    }

    console.error(error);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
    });
};