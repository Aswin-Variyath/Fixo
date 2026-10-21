import { AadhaarOcrResult } from "./aadhaar-ocr-result.interface";

export interface IAadhaarOcrService {
    extractAadhaarDetails(imageBuffer: Buffer): Promise<AadhaarOcrResult>;
}