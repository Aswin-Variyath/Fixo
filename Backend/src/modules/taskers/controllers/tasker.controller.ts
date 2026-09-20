import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../di";
import { ITaskerQueryService, NearbyTaskerLocation } from "../interfaces/tasker-query-service.interface";
import { StatusCodes } from "http-status-codes";
import { successResponse } from "../../../shared/utils/response.util";
import { HttpResponse } from "../../../shared/constants";
import { AppError } from "../../../shared/errors/app.error";
import { NearbyTaskerInput } from "../validations/nearby-tasker.schema";
import { TaskerDiscoveryQuery } from "../validations/tasker-discovery.schema";


@injectable()
export class TaskerController {
    constructor(@inject(TYPES.TaskerQueryService) private readonly taskerQueryService:ITaskerQueryService) {}
    getNearbyTasker = async (req:Request, res:Response):Promise<void> => {
        if(!req.user) throw new AppError(StatusCodes.UNAUTHORIZED,"Authentication required")
        const {serviceId, addressId, latitude, longitude, distance, searchId, page, sortBy}: NearbyTaskerInput = req.query as unknown as NearbyTaskerInput
        const location: NearbyTaskerLocation = {
            addressId: addressId as string | undefined,
            latitude: latitude !== undefined ? Number(latitude) : undefined,
            longitude: longitude !== undefined ? Number(longitude) : undefined
        }
        const result = await this.taskerQueryService.findNearbyTasker(
            req.user.userId,
             serviceId as string | undefined, 
             location, 
             distance !== undefined ? Number(distance) : undefined, 
             searchId as string | undefined, 
             page !== undefined ? Number(page) : undefined,
             sortBy
        )
        res.status(StatusCodes.OK).json(successResponse(HttpResponse.TASKER.NEARBY,result))
    }

    discoverTaskers = async(req:Request, res:Response):Promise<void> => {
        if(!req.user) throw new AppError(StatusCodes.UNAUTHORIZED,"Authentication required")
        const {addressId, latitude, longitude, distance, searchId,page,sortBy}:TaskerDiscoveryQuery  = req.query as unknown as TaskerDiscoveryQuery
        
        const location: NearbyTaskerLocation = {
            addressId:addressId as string | undefined,
            latitude: latitude !== undefined ? Number(latitude) : undefined,
            longitude: longitude !== undefined ? Number(longitude) : undefined
        }

        const result = await this.taskerQueryService.discoverTaskers(req.user.userId,location,distance !== undefined ? Number(distance) : undefined, searchId as string | undefined, page !== undefined ? Number(page) : undefined, sortBy)
        
        res.status(StatusCodes.OK).json(successResponse(HttpResponse.TASKER.NEARBY,result))
    }
}