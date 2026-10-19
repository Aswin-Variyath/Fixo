import multer from "multer";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../errors/app.error";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "application/pdf",
];

export const kycUpload = multer({
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
                    "Only JPEG, PNG, and PDF files are allowed"
                )
            );
            return;
        }

        callback(null, true);
    },
}).single("document");