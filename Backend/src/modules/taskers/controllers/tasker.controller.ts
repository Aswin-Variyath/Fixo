import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../di";
import { ITaskerQueryService, NearbyTaskerLocation, TaskerSearchCriteria } from "../interfaces/tasker-query-service.interface";
import { StatusCodes } from "http-status-codes";
import { successResponse } from "../../../shared/utils/response.util";
import { HttpResponse } from "../../../shared/constants";
import { AppError } from "../../../shared/errors/app.error";
import { NearbyTaskerInput } from "../validations/nearby-tasker.schema";


@injectable()
export class TaskerController {
    constructor(@inject(TYPES.TaskerQueryService) private readonly taskerQueryService:ITaskerQueryService) {}
    searchTaskers = async(req:Request, res:Response):Promise<void> => {
        if(!req.user) throw new AppError(StatusCodes.UNAUTHORIZED,"Authentication required")
        const {serviceId,addressId,latitude,longitude,distance, requestedDate,requestedTime,searchId,page,sortBy}:NearbyTaskerInput = req.query as unknown as NearbyTaskerInput
        const location:NearbyTaskerLocation = {
            addressId:addressId as string | undefined,
            latitude: latitude !== undefined ? Number(latitude) : undefined,
            longitude: longitude !== undefined ? Number(longitude) : undefined

        }
        const criteria: TaskerSearchCriteria = {
            serviceId: serviceId as string | undefined,
            location,
            distanceKm: Number(distance),
            requestedDate: requestedDate !== undefined ? new Date(requestedDate) : undefined,
            requestedTime: requestedTime as string | undefined,
            sortBy: sortBy ?? 'recommended'
        }
        const result = await this.taskerQueryService.searchTaskers(req.user.userId,criteria,searchId as string | undefined, page !== undefined ? Number(page) : undefined)
        res.status(StatusCodes.OK).json(successResponse(HttpResponse.TASKER.NEARBY,result))
    }
}