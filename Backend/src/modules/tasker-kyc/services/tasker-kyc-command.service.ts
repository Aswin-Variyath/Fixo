import { inject, injectable } from "inversify";
import { TYPES } from "../../../di";
import { ITaskerKycRepository } from "../interfaces/tasker-kyc-repository.interface";
import { ICloudinaryStorageService } from "../../../shared/providers/cloudinary/interfaces/cloudinary-storage.service.interface";
import { AppError } from "../../../shared/errors/app.error";
import { StatusCodes } from "http-status-codes";
import { encryptKycData } from "../../../shared/security/kyc-encryption";
import { ITaskerKycCommandService } from "../interfaces/tasker-kyc-command-service.interface";
import { KycDocumentType, TaskerKycStatus } from "../../../database/generated/prisma/enums";
import { KycWizardStep } from "../constants/kyc-wizard-steps";

@injectable()
export class TaskerKycCommandService implements ITaskerKycCommandService {
    constructor(
        @inject(TYPES.TaskerKycRepository) private readonly taskerKycRepository: ITaskerKycRepository,
        @inject(TYPES.CloudinaryStorageService) private readonly cloudinaryStorageService:ICloudinaryStorageService
    ) {}
    async submitKyc(userId: string): Promise<void> {
        const profile = await this.taskerKycRepository.findTaskerProfileByUserId(userId)
        if(!profile) throw new AppError(StatusCodes.NOT_FOUND,"Tasker profile not found")
        if(!profile.kyc) throw new AppError(StatusCodes.NOT_FOUND,"Create your KYC record before submitting")
        if(profile.kyc.status === TaskerKycStatus.PENDING || profile.kyc.status === TaskerKycStatus.VERIFIED) throw new AppError(StatusCodes.CONFLICT,"KYC has already been submitted or verified")
        const kyc = await this.taskerKycRepository.findKycSubmissionData(profile.id)
        if(!kyc) throw new AppError(StatusCodes.NOT_FOUND, "KYC record not found")
        const missingFields:string[] = []
        if(!kyc.bankAccountHolderName?.trim()) missingFields.push("Bank account holder name")
        if(!kyc.bankAccountNumber) missingFields.push("Bank account number")
        if(!kyc.ifscCode?.trim()) missingFields.push("IFSC code")
        const requiredDocuments: {
            type:KycDocumentType
            label:string
        }[] = [
            { type: KycDocumentType.SELFIE, label: "Selfie" },
            { type: KycDocumentType.AADHAAR_FRONT, label: "Aadhaar front" },
            { type: KycDocumentType.AADHAAR_BACK, label: "Aadhaar back" },
            { type: KycDocumentType.BANK_PASSBOOK, label: "Bank passbook" },
        ]
        for(const document of requiredDocuments) {
            const exists = kyc.documents.some((item)=>item.type === document.type)
            if(!exists) missingFields.push(document.label)
        }
        if(missingFields.length > 0) throw new AppError(StatusCodes.BAD_REQUEST, `Complete the following before submission: ${missingFields.join(", ")}`)
        const submitted = await this.taskerKycRepository.submitKyc(profile.id)
        if(!submitted) throw new AppError(StatusCodes.CONFLICT, "KYC status changed. Refresh your KYC details and try again.")
    }
    async updateBankDetails(userId: string,bankAccountHolderName: string, bankAccountNumber: string, ifscCode: string): Promise<void> {
        const profile = await this.taskerKycRepository.findTaskerProfileByUserId(userId)
        if(!profile?.kyc) throw new AppError(StatusCodes.NOT_FOUND,"KYC record not found")
        if(profile.kyc.status === TaskerKycStatus.PENDING || profile.kyc.status === TaskerKycStatus.VERIFIED) throw new AppError(StatusCodes.CONFLICT,"Bank details cannot be changed while KYC is pending or verified")
        const encryptedBankAccountNumber = encryptKycData(Buffer.from(bankAccountNumber,"utf8")).toString("base64")
        await this.taskerKycRepository.updateKycBankDetails({
            taskerProfileId:profile.id,
            bankAccountHolderName,
            encryptedBankAccountNumber,
            ifscCode
        })
    }
    async uploadDocument(userId: string, type: KycDocumentType, fileBuffer: Buffer): Promise<void> {
        const profile = await this.taskerKycRepository.findTaskerProfileByUserId(userId)
        if(!profile?.kyc) throw new AppError(StatusCodes.NOT_FOUND, "Create your KYC record before uploading documents")
        if(profile.kyc.status === TaskerKycStatus.PENDING || profile.kyc.status === TaskerKycStatus.VERIFIED) throw new AppError(StatusCodes.CONFLICT,"Documents cannot be changed while KYC is pending or verified")
        const encryptedFile = encryptKycData(fileBuffer)
        const uploadedFile = await this.cloudinaryStorageService.uploadEncryptedKycFile(encryptedFile)
        try {
            await this.taskerKycRepository.createKycDocument({
                taskerKycId:profile.kyc.id,
                type,
                storageReference:uploadedFile.publicId
            })
        } catch (error) {
            await this.cloudinaryStorageService.deleteEncryptedKycFile(uploadedFile.publicId)
            throw error
        }
    }

    async createKyc(userId:string,bankAccountHolderName: string,bankAccountNumber:string,ifscCode:string):Promise<void> {
        const profile = await this.taskerKycRepository.findTaskerProfileByUserId(userId)
        console.log("Authenticated user in command service",profile)
        if(!profile) throw new AppError(StatusCodes.NOT_FOUND,"Tasker profile not found")
        if(profile.kyc) throw new AppError(StatusCodes.CONFLICT,"KYC record already exists")
        const encryptedBankAccountNumber = encryptKycData(Buffer.from(bankAccountNumber,"utf8")).toString('base64')
        await this.taskerKycRepository.createKyc({
            taskerProfileId:profile.id,
            bankAccountHolderName,
            encryptedBankAccountNumber,
            ifscCode
        })
    }

    async saveProgress(userId: string, currentStep: KycWizardStep): Promise<void> {
        const profile = await this.taskerKycRepository.findTaskerProfileByUserId(userId)
        if(!profile?.kyc) throw new AppError(StatusCodes.NOT_FOUND,"Create your KYC record before saving progress")
        if(profile.kyc.status === TaskerKycStatus.PENDING || profile.kyc.status === TaskerKycStatus.VERIFIED) throw new AppError(StatusCodes.CONFLICT,"KYC progress cannot be changed while verification is pending or completed")
        await this.taskerKycRepository.updateCurrentStep(profile.id,currentStep)
    }
}