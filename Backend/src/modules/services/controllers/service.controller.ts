import { inject, injectable } from "inversify";
import { TYPES } from "../../../di";
import { IserviceQueryService } from "../interfaces/service-query-service.interface";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { successResponse } from "../../../shared/utils/response.util";
import { HttpResponse } from "../../../shared/constants";

@injectable()
export class ServiceController {
    constructor(@inject(TYPES.ServiceQueryService) private readonly serviceQueryServices:IserviceQueryService) {}
    getServices = async(req:Request,res:Response):Promise<void> => {
        const cotegoryId = typeof req.query.categoryId === "string" ? req.query.categoryId : undefined
        const search = typeof req.query.search === "string" ? req.query.search : undefined
        const limit = typeof req.query.limit === "string" ? Number(req.query.limit) : undefined
        const offset = typeof req.query.offset === "string" ? Number(req.query.offset) : undefined
        const result = await this.serviceQueryServices.getServices(cotegoryId,search,limit,offset)
        res.status(StatusCodes.OK).json(successResponse(HttpResponse.SERVICE.LIST,result))
    }
}