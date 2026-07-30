import { injectable } from "inversify";
import { IAuthorizationMiddleware } from "../interfaces/authoriazation-middleware.interface";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../shared/errors/app.error";

@injectable()
export class AuthorizationMiddleware implements IAuthorizationMiddleware {
    authorize(...role: string[]) {
        return (req:Request, res: Response, next: NextFunction):void => {
            if(!req.user) throw new AppError(403, "User is not authenticated")
            if(!role.includes(req.user.role)) throw new AppError(403, "You do not have permission to access this resource")
            next()
        }
    }
    
}

