import { injectable } from "inversify";
import { StatusCodes } from "http-status-codes";
import { PassbookOcrResult } from "../../../modules/tasker-kyc/interfaces/passbook-ocr-result.interface";
import { AppError } from "../../errors/app.error";
import { ENV } from "../../../config/env.config";

interface OcrSpaceResponse {
    IsErroredOnProcessing: boolean;
    ErrorMessage?: string | string[];
    ParsedResults?: Array<{
        ParsedText?: string;
        FileParseExitCode?: number;
    }>;
}

@injectable()
export class OcrService {
    async extractPassbookDetails(
        imageBuffer: Buffer,
    ): Promise<PassbookOcrResult> {
        const apiKey = ENV.OCR_SPACE.API_KEY;

        if (!apiKey) {
            throw new AppError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                "OCR service is not configured",
            );
        }

        const formData = new FormData();

        formData.append(
            "file",
            new Blob([new Uint8Array(imageBuffer)]),
            "passbook.jpg",
        );
        formData.append("OCREngine", "2");
        formData.append("language", "eng");
        formData.append("isOverlayRequired", "false");

        let apiResponse: Response;

        try {
            apiResponse = await fetch(ENV.OCR_SPACE.API_URL, {
                method: "POST",
                headers: {
                    apikey: apiKey,
                },
                body: formData,
                signal: AbortSignal.timeout(30_000),
            });
        } catch {
            throw new AppError(
                StatusCodes.BAD_GATEWAY,
                "Unable to connect to the OCR service. Please try again later.",
            );
        }

        if (!apiResponse.ok) {
            throw new AppError(
                StatusCodes.BAD_GATEWAY,
                "OCR provider request failed",
            );
        }

        let result: OcrSpaceResponse;

        try {
            result = (await apiResponse.json()) as OcrSpaceResponse;
        } catch {
            throw new AppError(
                StatusCodes.BAD_GATEWAY,
                "Invalid response received from the OCR service",
            );
        }

        if (result.IsErroredOnProcessing) {
            throw new AppError(
                StatusCodes.BAD_GATEWAY,
                "Unable to extract text from the uploaded document",
            );
        }

        const rawText = (result.ParsedResults ?? [])
            .map((page) => page.ParsedText ?? "")
            .join("\n");

        if (!rawText.trim()) {
            throw new AppError(
                StatusCodes.UNPROCESSABLE_ENTITY,
                "No readable text found in the uploaded document",
            );
        }

        const nameMatch = rawText.match(
            /^\s*Name\s*:\s*(?:(?:MR|MRS|MS)\.?\s*)?([A-Z][A-Z .'-]{1,40})\s*$/im,
        );

        const accountMatch = rawText.match(
            /^\s*Account\s*(?:No\.?|Number)?\s*:\s*(?:\r?\n\s*)?([0-9]{9,18})\s*$/im,
        );

        const ifscMatch = rawText.match(
            /\bIFSC\s*:\s*([A-Z]{4}0[A-Z0-9]{6})\b/i,
        );

        return {
            bankAccountHolderName: nameMatch?.[1]?.trim() ?? null,
            bankAccountNumber: accountMatch?.[1] ?? null,
            ifscCode: ifscMatch?.[1]?.toUpperCase() ?? null,
            rawText: "",
        };
    }
}
