import { injectable } from "inversify";
import { IOpaqueTokenService, OpaqueTokenResult,  } from "../interfaces/opaque_token_service.interface";
import { createHash, randomBytes } from "node:crypto";

@injectable()
export class OpaqueTokenService implements IOpaqueTokenService {
    generate():OpaqueTokenResult{
        const token = randomBytes(64).toString("base64url")
        return {token, tokenHash: this.hash(token)}
    }
    hash(token: string): string {
        return createHash("sha256").update(token).digest("hex")
    }

    
    
}