import multer from "multer";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../errors/app.error";

const MAX_FILE_SIZE = 1 * 1024 * 1024;

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png"];

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: 1,
    },
    fileFilter: (_req, file, callback) => {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            callback(
                new AppError(
                    StatusCodes.BAD_REQUEST,
                    "Only JPEG and PNG files are allowed"
                )
            );
            return;
        }

        callback(null, true);
    },
}).single("document");

export const kycUpload: typeof upload = (req, res, next) => {
    upload(req, res, (err: unknown) => {
        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return next(
                    new AppError(
                        413,
                        "File size cannot exceed 1 MB"
                    )
                );
            }

            if (err.code === "LIMIT_UNEXPECTED_FILE") {
                return next(
                    new AppError(
                        StatusCodes.BAD_REQUEST,
                        "Unexpected file field. Please upload using the 'document' field."
                    )
                );
            }

            return next(
                new AppError(
                    StatusCodes.BAD_REQUEST,
                    "File upload failed. Please check the uploaded file."
                )
            );
        }

        if (err) {
            return next(err);
        }

        next();
    });
};