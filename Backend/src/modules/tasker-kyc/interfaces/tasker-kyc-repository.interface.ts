import { KycDocumentType, TaskerKycStatus } from "../../../database/generated/prisma/enums"

export interface TaskerKycDocumentRecord {
    id:string
    type:KycDocumentType
    createdAt:Date
}

export interface TaskerKycRecord {
    id:string
    taskerProfileId:string
    status:TaskerKycStatus
    createdAt:Date
    updatedAt:Date
    documents:TaskerKycDocumentRecord[]
}

export interface TaskerKycProfileRecord {
    id:string
    kyc: {
        id:string
        status:TaskerKycStatus
        updatedAt:Date
        createdAt:Date
        documents:TaskerKycDocumentRecord[]
    } | null
}

export interface CreateTaskerKycData {
    taskerProfileId:string
    encryptedBankAccountNumber:string
    ifscCode:string
}

export interface UpdateTaskerKycBankDetailsData {
    taskerProfileId:string
    encryptedBankAccountNumber:string
    ifscCode:string
}

export interface CreateTaskerKycDocumentData {
    taskerKycId: string;
    type: KycDocumentType;
    storageReference: string;
}

export interface ITaskerKycRepository {
    findTaskerProfileByUserId(userId:string):Promise<TaskerKycProfileRecord | null>
    findKycByTaskerProfileId(taskerProfileId:string):Promise<TaskerKycRecord | null>
    createKyc(data:CreateTaskerKycData):Promise<void>
    updateKycBankDetails(data:UpdateTaskerKycBankDetailsData):Promise<void>
    createKycDocument(data:CreateTaskerKycDocumentData):Promise<TaskerKycDocumentRecord>
    updateKycStatus(taskerprofileId:string, status: TaskerKycStatus):Promise<void>
}