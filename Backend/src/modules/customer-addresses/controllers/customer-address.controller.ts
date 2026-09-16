import { inject, injectable } from "inversify";
import { TYPES } from "../../../di";
import { ICustomerAddressQueryService } from "../interfaces/customer-address-query-service.interface";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { successResponse } from "../../../shared/utils/response.util";
import { HttpResponse } from "../../../shared/constants";
import { AppError } from "../../../shared/errors/app.error";

@injectable()
export class CustomerAddressController {
    constructor(
        @inject(TYPES.CustomerAddressQueryService) private readonly customerAddressQueryService:ICustomerAddressQueryService
    ) {}

    getCustomerAddress = async (req:Request, res:Response):Promise<void> =>{
        const userId = req.user?.userId
        if(!userId) throw new AppError(StatusCodes.UNAUTHORIZED,"Authentication required")
        const address = await this.customerAddressQueryService.getCustomerAddressess(userId)
        res.status(StatusCodes.OK).json(successResponse(HttpResponse.CUSTOMER_ADDRESS.LIST,address))
    }
}