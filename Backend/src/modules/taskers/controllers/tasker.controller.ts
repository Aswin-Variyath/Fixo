import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../di";
import { ITaskerQueryService } from "../interfaces/tasker-query-service.interface";
import { StatusCodes } from "http-status-codes";
import { successResponse } from "../../../shared/utils/response.util";
import { HttpResponse } from "../../../shared/constants";

@injectable()
export class TaskerController {
    constructor(@inject(TYPES.TaskerQueryService) private readonly taskerQueryService:ITaskerQueryService) {}
    getNearbyTasker = async (req:Request, res:Response):Promise<void> => {
        const serviceId = req.query.serviceId as string
        const latitude = Number(req.query.latitude)
        const longitude = Number(req.query.longitude)
        const distanceKm = Number(req.query.distance)
        const result = await this.taskerQueryService.findNearbyTasker(serviceId, latitude, longitude, distanceKm)

        res.status(StatusCodes.OK).json(successResponse(HttpResponse.TASKER.NEARBY,result))
    }
}