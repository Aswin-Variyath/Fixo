import { injectable } from "inversify";
import { IRefreshTokenService, RefreshTokenResult } from "../interfaces/refresh-token-service.interface";
import { createHash, randomBytes } from "node:crypto";

@injectable()
export class RefreshTokenService implements IRefreshTokenService {
    generate():RefreshTokenResult{
        const token = randomBytes(64).toString("base64url")
        return {token, tokenHash: this.hash(token)}
    }
    hash(token: string): string {
        return createHash("sha256").update(token).digest("hex")
    }
}