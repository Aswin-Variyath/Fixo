import { PassbookOcrResult } from "./passbook-ocr-result.interface";

export interface IPassbookOcrService {
    extractPassbookDetails(imageBuffer: Buffer): Promise<PassbookOcrResult>;
}