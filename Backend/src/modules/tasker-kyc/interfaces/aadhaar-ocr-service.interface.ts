import { AadhaarOcrResult } from "./aadhaar-ocr-result.interface";

export interface IAadhaarOcrService {
    extractAadhaarDetails(frontImageBuffer: Buffer,backImageBuffer: Buffer): Promise<AadhaarOcrResult>;
}