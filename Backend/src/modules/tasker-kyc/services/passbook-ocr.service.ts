import { inject, injectable } from "inversify";
import { IPassbookOcrService } from "../interfaces/passbook-ocr-service.interface";
import { TYPES } from "../../../di";
import { OcrService } from "../../../shared/providers/optical_character_recognition/optical_character_recognition.ocr.service";
import { PassbookOcrResult } from "../interfaces/passbook-ocr-result.interface";

@injectable()
export class PassbookOcrService implements IPassbookOcrService {
    constructor(
        @inject(TYPES.OcrService) private readonly ocrService:OcrService
    ) {}

    async extractPassbookDetails(imageBuffer: Buffer): Promise<PassbookOcrResult> {
        return this.ocrService.extractPassbookDetails(imageBuffer)
    }
}