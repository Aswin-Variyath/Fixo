import { inject, injectable } from "inversify";
import { ITaskerKycRepository, TaskerKycProfileRecord } from "../interfaces/tasker-kyc-repository.interface";
import { ITaskerKycQueryService } from "../interfaces/tasker-kyc-query-service.interface";
import { AppError } from "../../../shared/errors/app.error";
import { StatusCodes } from "http-status-codes";
import { TYPES } from "../../../di";

@injectable()
export class TaskerKycQueryService implements ITaskerKycQueryService {
    constructor(
        @inject(TYPES.TaskerKycRepository) private readonly taskerKycRepository:ITaskerKycRepository
    ) {}
    async getKycDetails(userId: string): Promise<TaskerKycProfileRecord> {
        const profile = await this.taskerKycRepository.findTaskerProfileByUserId(userId)
        if(!profile) throw new AppError(StatusCodes.NOT_FOUND, "Tasker profile not found")
        return profile
    }
    
}