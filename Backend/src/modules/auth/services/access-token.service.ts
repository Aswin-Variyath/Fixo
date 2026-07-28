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
      ENV.JWT.accessSecret,
      {
        subject: payload.userId,
        issuer: ENV.JWT.issuer,
        audience: ENV.JWT.audience,
        expiresIn: ENV.JWT.accessTokenTtlSeconds,
      },
    );
  }
  
  verify(token: string): AccessTokenPayload {
    const payload = jwt.verify(token, ENV.JWT.accessSecret,{
      issuer:ENV.JWT.issuer,
      audience:ENV.JWT.audience
    }) as JwtPayload

    return {
      userId:payload.sub!,
      role: payload.role as string,
      sessionId: payload.sessionId as string
    }
  }
}
