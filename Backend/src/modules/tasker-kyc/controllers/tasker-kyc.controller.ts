import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../../../di";
import { ITaskerKycCommandService } from "../interfaces/tasker-kyc-command-service.interface";
import { ITaskerKycQueryService } from "../interfaces/tasker-kyc-query-service.interface";
import { CreateTaskerKycDto } from "../validations/create-tasker-kyc.schema";
import { AppError } from "../../../shared/errors/app.error";
import { StatusCodes } from "http-status-codes";
import { successResponse } from "../../../shared/utils/response.util";
import { UpdateTaskerKycDto } from "../validations/update-tasker-kyc-bank-details.schema";
import { UploadTaskerKycDocumentDto } from "../validations/upload-tasker-kyc-document.schema";

@injectable()
export class TaskerKycController {
    constructor(
        @inject(TYPES.TaskerKycCommandService) private readonly taskerKycCommandService:ITaskerKycCommandService,
        @inject(TYPES.TaskerKycQueryService) private readonly taskerKycQueryService:ITaskerKycQueryService,
    ) {}

    createKyc = async (req:Request<Record<string,never>,unknown, CreateTaskerKycDto['body']>,res:Response):Promise<void> => {
        const userId = req.user?.userId
        if(!userId) throw new AppError(StatusCodes.UNAUTHORIZED,"Authentication required")
        await this.taskerKycCommandService.createKyc(userId,req.body.bankAccountNumber,req.body.ifscCode)
        res.status(StatusCodes.CREATED).json(successResponse("KYC record created successfully"))
    }

    updateBankDetails = async(req:Request<Record<string, never>, unknown, UpdateTaskerKycDto["body"]>,res:Response):Promise<void> => {
        const userId = req.user?.userId
        if(!userId) throw new AppError(StatusCodes.UNAUTHORIZED,"Authentication required")
        await this.taskerKycCommandService.updateBankDetails(userId,req.body.bankAccountNumber,req.body.ifscCode)
        res.status(StatusCodes.OK).json(successResponse("Bank details updated successfully"))
    }

    uploadDocument = async(req:Request<Record<string, never>, unknown, UploadTaskerKycDocumentDto["body"]>, res:Response):Promise<void> => {
        const userId = req.user?.userId
        if(!userId) throw new AppError(StatusCodes.UNAUTHORIZED, "Authentication required")
        if(!req.file) throw new AppError(StatusCodes.BAD_REQUEST, "Document file is required")
        await this.taskerKycCommandService.uploadDocument(userId,req.body.type,req.file.buffer)
        res.status(StatusCodes.CREATED).json(successResponse("KYC document uploaded successfully"))
    }

    getKycDetails = async(req:Request,res:Response):Promise<void> => {
        const userId = req.user?.userId
        if(!userId) throw new AppError(StatusCodes.UNAUTHORIZED, "Authentication required")
        const result = await this.taskerKycQueryService.getKycDetails(userId)
        res.status(StatusCodes.OK).json(successResponse("KYC details retrieved successfully", result))
    }
}