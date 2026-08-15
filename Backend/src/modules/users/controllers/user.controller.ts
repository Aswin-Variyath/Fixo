import { Response, Request } from "express";
import { inject, injectable } from "inversify";
import { IUserQueryService } from "../interfaces/user-query-service.interface";
import { TYPES } from "../../../di";
import { AppError } from "../../../shared/errors/app.error";
import { StatusCodes } from "http-status-codes";
import { successResponse } from "../../../shared/utils/response.util";
import { HttpResponse } from "../../../shared/constants";

@injectable()
export class UserController {

    constructor(@inject(TYPES.UserQueryService) private readonly userQueryService: IUserQueryService) {}

    getCurrentUser = async(req:Request, res: Response):Promise<void> => {

        if(!req.user) throw new AppError(StatusCodes.UNAUTHORIZED,"Authentication required")

        const user = await this.userQueryService.getCurrentUser(req.user.userId)

        res.status(StatusCodes.OK).json(successResponse(HttpResponse.USER.CURRENT_USER,user))
    }
}