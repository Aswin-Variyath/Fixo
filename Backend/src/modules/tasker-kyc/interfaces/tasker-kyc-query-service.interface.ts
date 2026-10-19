import { KycDocumentType, TaskerKycStatus } from "../../../database/generated/prisma/enums";

export interface TaskerKycReviewSummary {
    id: string;
    bankAccountHolderName: string;
    maskedBankAccountNumber: string;
    ifscCode: string;
    currentStep: string;
    status: TaskerKycStatus;
    createdAt: Date;
    updatedAt: Date;
    documents: {
        id: string;
        type: KycDocumentType;
        createdAt: Date;
    }[];
}

export interface ITaskerKycQueryService {
    getKycDetails(userId: string): Promise<{id: string;kyc: TaskerKycReviewSummary | null;}>;
}