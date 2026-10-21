import { inject, injectable } from "inversify";
import { IAadhaarOcrService } from "../interfaces/aadhaar-ocr-service.interface";
import { TYPES } from "../../../di";
import { OcrService } from "../../../shared/providers/optical_character_recognition/optical_character_recognition.ocr.service";
import { AadhaarOcrResult } from "../interfaces/aadhaar-ocr-result.interface";

@injectable()
export class AadhaarOcrService implements IAadhaarOcrService {
    constructor(
        @inject(TYPES.OcrService) private readonly ocrService: OcrService
    ) {}

    async extractAadhaarDetails(imageBuffer: Buffer): Promise<AadhaarOcrResult> {
        return this.ocrService.extractAadhaarDetails(imageBuffer)
    }
}