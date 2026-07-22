import { Response, Request } from "express";
import { inject, injectable } from "inversify";
import { IUserQueryService } from "../interfaces/user-query-service.interface";
import { TYPES } from "../../../di";

@injectable()
export class UserController {

    constructor(@inject(TYPES.UserQueryService) private readonly userQueryService: IUserQueryService) {}

    listUser = async(req:Request, res: Response):Promise<void> =>{
        const users = await this.userQueryService.listUsers();
        res.status(200).json({success:true, data:users})
    }
}