import { KycDocumentType } from "../../../database/generated/prisma/enums"
import { KycWizardStep } from "../constants/kyc-wizard-steps"

export interface ITaskerKycCommandService {
    createKyc(userId:string,bankAccountHolderName: string,bankAccountNumber:string,ifscCode:string):Promise<void>
    updateBankDetails(userId:string,bankAccountHolderName: string,bankAccountNumber:string,ifscCode:string):Promise<void>
    uploadDocument(userId:string,type:KycDocumentType,fileBuffer:Buffer):Promise<void>
    saveProgress(userId:string,currentStep:KycWizardStep):Promise<void>
    submitKyc(userId: string): Promise<void>;
}