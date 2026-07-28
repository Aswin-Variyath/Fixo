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
        @inject(TYPES.AccessTokenService) private readonly accessTokenService: IAccessTokenService,
        @inject(TYPES.SessionStore) private readonly sessionStore: IsessionStore
) {}
    authenticate = async (req: Request, res: Response, next: NextFunction):Promise<void> =>{

        const accessToken = req.cookies?.accessToken

        if(!accessToken || typeof accessToken !== "string") throw new UnauthorizedError("Authentication required")
        
        const payload = this.accessTokenService.verify(accessToken)

        const session = await this.sessionStore.findById(payload.sessionId)
        
        if(!session) throw new UnauthorizedError("Session not found")

        if(session.status !== "ACTIVE") throw new UnauthorizedError("Session has been revoked")

        if(session?.userId !== payload.userId) throw new UnauthorizedError("Invalid Session")
        
        req.user = {
            userId:payload.userId,
            role:payload.role,
            sessionId:payload.sessionId
        }
        next()
    }
}