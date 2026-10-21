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
import { UpdateKycProgressDto } from "../validations/update-kyc-progress.schema";
import { OcrService } from "../../../shared/providers/optical_character_recognition/optical_character_recognition.ocr.service";
import { IPassbookOcrService } from "../interfaces/passbook-ocr-service.interface";
import { PassbookOcrResponse } from "../interfaces/passbook-ocr-response.interface";

@injectable()
export class TaskerKycController {
    constructor(
        @inject(TYPES.TaskerKycCommandService) private readonly taskerKycCommandService:ITaskerKycCommandService,
        @inject(TYPES.TaskerKycQueryService) private readonly taskerKycQueryService:ITaskerKycQueryService,
        @inject(TYPES.OcrService) private readonly ocrService:OcrService,
        @inject(TYPES.PassbookOcrService) private readonly passbookOcrService:IPassbookOcrService,
    ) {}

    createKyc = async (req:Request<Record<string,never>,unknown, CreateTaskerKycDto['body']>,res:Response):Promise<void> => {
        console.log("Authenticated user ID:", req.user?.userId)
        const userId = req.user?.userId
        if(!userId) throw new AppError(StatusCodes.UNAUTHORIZED,"Authentication required")
        await this.taskerKycCommandService.createKyc(userId,req.body.bankAccountHolderName,req.body.bankAccountNumber,req.body.ifscCode)
        res.status(StatusCodes.CREATED).json(successResponse("KYC record created successfully"))
    }

    updateBankDetails = async(req:Request<Record<string, never>, unknown, UpdateTaskerKycDto["body"]>,res:Response):Promise<void> => {
        const userId = req.user?.userId
        if(!userId) throw new AppError(StatusCodes.UNAUTHORIZED,"Authentication required")
        await this.taskerKycCommandService.updateBankDetails(userId,req.body.bankAccountHolderName,req.body.bankAccountNumber,req.body.ifscCode)
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

    saveProgress = async( req: Request<Record<string, never>, unknown, UpdateKycProgressDto["body"]>,res:Response):Promise<void> => {
        const userId = req.user?.userId
        if(!userId) throw new AppError(StatusCodes.UNAUTHORIZED,"Authentication required")
        await this.taskerKycCommandService.saveProgress(userId,req.body.currentStep)
        res.status(StatusCodes.OK).json(successResponse("KYC progress saved successfully"))
    }
    submitKyc = async(req: Request, res: Response):Promise<void> => {
        const userId = req.user?.userId
        if(!userId) throw new AppError(StatusCodes.UNAUTHORIZED, "Authentication required")
        await this.taskerKycCommandService.submitKyc(userId)
        res.status(StatusCodes.OK).json(successResponse("KYC submitted successfully"))
    }

    extractPassbookDetails = async(req:Request,res:Response):Promise<void> => {
        const userId = req.user?.userId
        if(!userId) throw new AppError(StatusCodes.UNAUTHORIZED,"Authentication required")
        if(!req.file) throw new AppError(StatusCodes.BAD_REQUEST,"Passbook image is required",)
        const result = await this.passbookOcrService.extractPassbookDetails(req.file.buffer)
        const response: PassbookOcrResponse = {
            bankAccountHolderName: result.bankAccountHolderName,
            bankAccountNumber: result.bankAccountNumber,
            ifscCode: result.ifscCode,
        }
        res.status(StatusCodes.OK).json(successResponse("Passbook details extracted successfully", response))
    }
}