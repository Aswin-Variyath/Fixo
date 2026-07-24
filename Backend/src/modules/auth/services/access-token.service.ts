import { injectable } from "inversify";
import {AccessTokenPayload,IAccessTokenService} from "../interfaces/access-token-service.interface";
import jwt from "jsonwebtoken";
import { ENV } from "../../../config/env.config";

@injectable()
export class AccessTokenSerivce implements IAccessTokenService {
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
}
