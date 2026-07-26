import { inject, injectable } from "inversify";
import { IAuthMiddleWare } from "../interfaces/auth-middleware.interface";
import { IAccessTokenService } from "../interfaces/access-token-service.interface";
import {TYPES} from '../../../di/identifiers'
import { IsessionStore } from "../interfaces/session-store.interface";
import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../../../shared/errors/unauthorized.error";


@injectable()
export class AuthMiddleware implements IAuthMiddleWare {
    constructor(
        @inject(TYPES.AuthCommandService) private readonly accessTokenService: IAccessTokenService,
        @inject(TYPES.SessionStore) private readonly sessionStore: IsessionStore
) {}
    async authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
        const accessToken = req.cookies?.accessToken
        if(!accessToken || typeof accessToken !== "string") {
            throw new UnauthorizedError("Authentication required")
        }
        next()
    }
}