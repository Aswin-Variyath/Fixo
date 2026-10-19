import { inject, injectable } from "inversify";
import { ITaskerKycRepository, TaskerKycProfileRecord } from "../interfaces/tasker-kyc-repository.interface";
import { ITaskerKycQueryService, TaskerKycReviewSummary } from "../interfaces/tasker-kyc-query-service.interface";
import { AppError } from "../../../shared/errors/app.error";
import { StatusCodes } from "http-status-codes";
import { TYPES } from "../../../di";
import { decryptKycData } from "../../../shared/security/kyc-encryption";

@injectable()
export class TaskerKycQueryService implements ITaskerKycQueryService {
    constructor(
        @inject(TYPES.TaskerKycRepository) private readonly taskerKycRepository:ITaskerKycRepository
    ) {}
    async getKycDetails(userId: string): Promise<{id: string;kyc: TaskerKycReviewSummary | null;}> {
        const profile = await this.taskerKycRepository.findTaskerProfileByUserId(userId)
        if(!profile) throw new AppError(StatusCodes.NOT_FOUND, "Tasker profile not found")
        if(!profile.kyc) {
            return {
                id: profile.id,
                kyc:null
            }
        }
        const encryptedAccountNumber = Buffer.from(profile.kyc.bankAccountNumber,"base64")
        const accountNumber = decryptKycData(encryptedAccountNumber).toString('utf8')
        const maskedAccountNumber = accountNumber.length <= 4 ? "*".repeat(accountNumber.length) : `******${accountNumber.slice(-4)}`
        return {
            id:profile.id,
            kyc: {
                id: profile.kyc.id,
                bankAccountHolderName: profile.kyc.bankAccountHolderName,
                maskedBankAccountNumber: maskedAccountNumber,
                ifscCode: profile.kyc.ifscCode,
                currentStep: profile.kyc.currentStep,
                status: profile.kyc.status,
                createdAt: profile.kyc.createdAt,
                updatedAt: profile.kyc.updatedAt,
                documents: profile.kyc.documents,
            }
        }
    }
    
}