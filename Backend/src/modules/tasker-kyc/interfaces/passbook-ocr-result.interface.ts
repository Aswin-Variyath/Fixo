export interface PassbookOcrResult {
    bankAccountHolderName: string | null;
    bankAccountNumber: string | null;
    ifscCode: string | null;
    rawText: string;
}