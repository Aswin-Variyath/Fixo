import { KycDocumentType } from "../../../database/generated/prisma/enums"

export interface ITaskerKycCommandService {
    createKyc(userId:string,bankAccountNumber:string,ifscCode:string):Promise<void>
    updateBankDetails(userId:string,bankAccountNumber:string,ifscCode:string):Promise<void>
    uploadDocument(userId:string,type:KycDocumentType,fileBuffer:Buffer):Promise<void>
}