import { inject, injectable } from "inversify";
import { TYPES } from "../../../di";
import { ITaskerKycRepository } from "../interfaces/tasker-kyc-repository.interface";
import { ICloudinaryStorageService } from "../../../shared/providers/cloudinary/interfaces/cloudinary-storage.service.interface";
import { AppError } from "../../../shared/errors/app.error";
import { StatusCodes } from "http-status-codes";
import { encryptKycData } from "../../../shared/security/kyc-encryption";
import { ITaskerKycCommandService } from "../interfaces/tasker-kyc-command-service.interface";
import { KycDocumentType, TaskerKycStatus } from "../../../database/generated/prisma/enums";

@injectable()
export class TaskerKycCommandService implements ITaskerKycCommandService {
    constructor(
        @inject(TYPES.TaskerKycRepository) private readonly taskerKycRepository: ITaskerKycRepository,
        @inject(TYPES.CloudinaryStorageService) private readonly cloudinaryStorageService:ICloudinaryStorageService
    ) {}
    async updateBankDetails(userId: string, bankAccountNumber: string, ifscCode: string): Promise<void> {
        const profile = await this.taskerKycRepository.findTaskerProfileByUserId(userId)
        if(!profile?.kyc) throw new AppError(StatusCodes.NOT_FOUND,"KYC record not found")
        if(profile.kyc.status === TaskerKycStatus.PENDING || profile.kyc.status === TaskerKycStatus.VERIFIED) throw new AppError(StatusCodes.CONFLICT,"Bank details cannot be changed while KYC is pending or verified")
        const encryptedBankAccountNumber = encryptKycData(Buffer.from(bankAccountNumber,"utf8")).toString("base64")
        await this.taskerKycRepository.updateKycBankDetails({
            taskerProfileId:profile.id,
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

    async createKyc(userId:string,bankAccountNumber:string,ifscCode:string):Promise<void> {
        const profile = await this.taskerKycRepository.findTaskerProfileByUserId(userId)
        if(!profile) throw new AppError(StatusCodes.NOT_FOUND,"Tasker profile not found")
        if(profile.kyc) throw new AppError(StatusCodes.CONFLICT,"KYC record already exists")
        const encryptedBankAccountNumber = encryptKycData(Buffer.from(bankAccountNumber,"utf8")).toString('base64')
        await this.taskerKycRepository.createKyc({
            taskerProfileId:profile.id,
            encryptedBankAccountNumber,
            ifscCode
        })
    }
}