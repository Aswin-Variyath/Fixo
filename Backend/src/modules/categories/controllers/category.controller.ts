import { inject, injectable } from "inversify";
import { TYPES } from "../../../di";
import { ICategoryQueryService } from "../interfaces/category-query-service.interface";
import { StatusCodes } from "http-status-codes";
import { successResponse } from "../../../shared/utils/response.util";
import { HttpResponse } from "../../../shared/constants";
import { Request, Response } from "express";


@injectable()
export class CategoryController {
    constructor(@inject(TYPES.CategoryQueryService) private readonly categoryQueryService: ICategoryQueryService) {}
    getCategories = async(req:Request,res:Response):Promise<void> => {
        const categories = await this.categoryQueryService.getCategories()
        res.status(StatusCodes.OK).json(successResponse(HttpResponse.CATEGORY.LIST,categories))
    }
}