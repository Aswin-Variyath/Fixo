import { injectable } from "inversify";
import {AccessTokenPayload, IAccessTokenService} from "../interfaces/access-token-service.interface";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ENV } from "../../../config/env.config";

@injectable()
export class AccessTokenService implements IAccessTokenService {

  generate(payload: AccessTokenPayload): string {
    return jwt.sign(
      {
        role: payload.role,
        sessionId: payload.sessionId,
      },
      ENV.AUTH.JWT.ACCESS_SECRET,
      {
        subject: payload.userId,
        issuer: ENV.AUTH.JWT.ISSUER,
        audience: ENV.AUTH.JWT.AUDIENCE,
        expiresIn: ENV.AUTH.TOKEN.ACCESS_TTL_SECONDS,
      },
    );
  }
  
  verify(token: string): AccessTokenPayload {
    const payload = jwt.verify(token, ENV.AUTH.JWT.ACCESS_SECRET,{
      issuer:ENV.AUTH.JWT.ISSUER,
      audience:ENV.AUTH.JWT.AUDIENCE
    }) as JwtPayload

    return {
      userId:payload.sub!,
      role: payload.role as string,
      sessionId: payload.sessionId as string
    }
  }
}
