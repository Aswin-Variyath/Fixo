import { injectable } from "inversify";
import { StatusCodes } from "http-status-codes";
import { PassbookOcrResult } from "../../../modules/tasker-kyc/interfaces/passbook-ocr-result.interface";
import { AadhaarOcrResult } from "../../../modules/tasker-kyc/interfaces/aadhaar-ocr-result.interface";
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
  private async extractText(
    imageBuffer: Buffer,
    fileName: string,
  ): Promise<string> {
    const apiKey = ENV.OCR_SPACE.API_KEY;

    if (!apiKey) {
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "OCR service is not configured",
      );
    }

    const formData = new FormData();

    formData.append("file", new Blob([new Uint8Array(imageBuffer)]), fileName);
    formData.append("OCREngine", "2");
    formData.append("language", "eng");
    formData.append("isOverlayRequired", "false");

    let apiResponse: Response;

    try {
      apiResponse = await fetch(ENV.OCR_SPACE.API_URL, {
        method: "POST",
        headers: { apikey: apiKey },
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
      .join("\n")
      .trim();

    if (!rawText) {
      throw new AppError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        "No readable text found in the uploaded document",
      );
    }

    return rawText;
  }

  async extractPassbookDetails(
    imageBuffer: Buffer,
  ): Promise<PassbookOcrResult> {
    const rawText = await this.extractText(imageBuffer, "passbook.jpg");

    this.validatePassbookDocument(rawText);

    const nameMatch = rawText.match(
      /^\s*(?:Account Holder Name|Name of Account Holder|Account Name|Name)\s*[:\-]\s*(?:(?:MR|MRS|MS)\.?\s*)?([A-Z][A-Z .'-]{1,50})\s*$/im,
    );

    const accountMatch =
      rawText.match(
        /^\s*(?:Account\s*(?:No\.?|Number)|A\/C\s*(?:No\.?|Number)?)\s*[:\-]?\s*(?:\r?\n\s*)?([0-9][0-9 ]{7,22})\s*$/im,
      ) ??
      rawText.match(
        /^\s*(?:Account\s*(?:No\.?|Number)|A\/C\s*(?:No\.?|Number)?)\s*[:\-]\s*([0-9][0-9 ]{7,22})/im,
      );

    const ifscMatch = rawText.match(
      /\bIFSC\s*(?:Code)?\s*[:\-]?\s*([A-Z]{4}0[A-Z0-9]{6})\b/i,
    );

    const bankAccountNumber = accountMatch?.[1]?.replace(/\s/g, "") ?? null;

    if (bankAccountNumber && !/^\d{9,18}$/.test(bankAccountNumber)) {
      throw new AppError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        "Could not reliably extract the bank account number. Please upload a clearer passbook image.",
      );
    }

    return {
      bankAccountHolderName: nameMatch?.[1]?.trim() ?? null,
      bankAccountNumber,
      ifscCode: ifscMatch?.[1]?.toUpperCase() ?? null,
      rawText: "",
    };
  }

  async extractAadhaarDetails(imageBuffer: Buffer): Promise<AadhaarOcrResult> {
    const rawText = await this.extractText(imageBuffer, "aadhaar.jpg");

    this.validateAadhaarDocument(rawText);

    const lines = rawText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    const labelledNameMatch = rawText.match(/^\s*Name\s*[:\-]\s*(.+?)\s*$/im);

    const excludedNameLine =
      /aadhaar|uidai|unique identification|government|authority|india|dob|date of birth|male|female|gender|mobile|phone|address|enrolment|enrollment|issue date|download date|help@|www\.|^\d+$/i;

    const nameLine = lines.find((line) => {
      const candidate = line.replace(/^(?:name)\s*[:\-]\s*/i, "").trim();

      return (
        /^[A-Z][A-Z .'-]{2,50}$/i.test(candidate) &&
        !excludedNameLine.test(candidate) &&
        !/\d/.test(candidate) &&
        !/^(?:S\/O|D\/O|W\/O|C\/O)\b/i.test(candidate)
      );
    });

    const extractedName =
      labelledNameMatch?.[1]?.trim() ??
      nameLine?.replace(/^(?:name)\s*[:\-]\s*/i, "").trim() ??
      null;

    const name =
      extractedName && !excludedNameLine.test(extractedName)
        ? extractedName
        : null;

    const maskedMatch = rawText.match(
      /\b(?:X{4}|[*]{4})[\s-]*(?:X{4}|[*]{4})[\s-]*([0-9]{4})\b/i,
    );

    const fullNumberMatch = rawText.match(
      /\b[0-9]{4}[\s-]*[0-9]{4}[\s-]*[0-9]{4}\b/,
    );

    let aadhaarNumberMasked: string | null = null;

    if (maskedMatch) {
      aadhaarNumberMasked = `XXXX XXXX ${maskedMatch[1]}`;
    } else if (fullNumberMatch) {
      const lastFour = fullNumberMatch[0].replace(/\D/g, "").slice(-4);

      aadhaarNumberMasked = `XXXX XXXX ${lastFour}`;
    }

    return {
      name,
      aadhaarNumberMasked,
    };
  }

  private validateAadhaarDocument(rawText: string): void {
    const hasAadhaarIndicator =
      /\baadhaar\b|\baadhar\b|\buidai\b|unique identification authority/i.test(
        rawText,
      );

    const hasIdentityDetails =
      /\b\d{4}[\s-]*\d{4}[\s-]*\d{4}\b/.test(rawText) ||
      /\b(?:dob|date of birth|male|female|address|s\/o|d\/o|w\/o|c\/o)\b/i.test(
        rawText,
      );

    if (!hasAadhaarIndicator || !hasIdentityDetails) {
      throw new AppError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        "The uploaded image does not appear to be a readable Aadhaar document. Please upload the correct image.",
      );
    }
  }

  private validatePassbookDocument(rawText: string): void {
    const hasBankIndicator =
      /\b(?:bank|banking|passbook|savings account|current account|ifsc)\b/i.test(
        rawText,
      );

    const hasAccountIndicator =
      /\b(?:account number|account no\.?|a\/c no\.?|ifsc|branch)\b/i.test(
        rawText,
      );

    if (!hasBankIndicator || !hasAccountIndicator) {
      throw new AppError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        "The uploaded image does not appear to be a readable bank passbook. Please upload the correct image.",
      );
    }
  }
}
