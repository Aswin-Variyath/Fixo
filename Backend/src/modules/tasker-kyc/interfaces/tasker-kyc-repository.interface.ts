import { KycDocumentType, TaskerKycStatus } from "../../../database/generated/prisma/enums"

export interface TaskerKycDocumentRecord {
    id:string
    type:KycDocumentType
    createdAt:Date
}

export interface TaskerKycRecord {
    id:string
    taskerProfileId:string
    currentStep: string
    status:TaskerKycStatus
    createdAt:Date
    updatedAt:Date
    documents:TaskerKycDocumentRecord[]
}

export interface TaskerKycProfileRecord {
    id:string
    kyc: {
        id:string
        bankAccountHolderName: string;
        bankAccountNumber: string;
        ifscCode: string;
        currentStep: string
        status:TaskerKycStatus
        updatedAt:Date
        createdAt:Date
        documents:TaskerKycDocumentRecord[]
    } | null
}

export interface CreateTaskerKycData {
    taskerProfileId:string
    bankAccountHolderName: string
    encryptedBankAccountNumber:string
    ifscCode:string
}

export interface UpdateTaskerKycBankDetailsData {
    taskerProfileId:string
    bankAccountHolderName: string
    encryptedBankAccountNumber:string
    ifscCode:string
}

export interface CreateTaskerKycDocumentData {
    taskerKycId: string;
    type: KycDocumentType;
    storageReference: string;
}

export interface TaskerKycSubmissionRecord {
    id: string;
    taskerProfileId: string;
    bankAccountHolderName: string;
    bankAccountNumber: string;
    ifscCode: string;
    status: TaskerKycStatus;
    documents: {
        type: KycDocumentType;
    }[];
}

export interface ITaskerKycRepository {
    findTaskerProfileByUserId(userId:string):Promise<TaskerKycProfileRecord | null>
    findKycByTaskerProfileId(taskerProfileId:string):Promise<TaskerKycRecord | null>
    createKyc(data:CreateTaskerKycData):Promise<void>
    updateKycBankDetails(data:UpdateTaskerKycBankDetailsData):Promise<void>
    createKycDocument(data:CreateTaskerKycDocumentData):Promise<TaskerKycDocumentRecord>
    updateKycStatus(taskerprofileId:string, status: TaskerKycStatus):Promise<void>
    updateCurrentStep(taskerProfileId: string,currentStep: string):Promise<void>
    findKycSubmissionData(taskerProfileId:string):Promise<TaskerKycSubmissionRecord | null>
    submitKyc(taskerProfileId:string):Promise<boolean>
}