import { injectable } from "inversify";
import { ITokenFamilyStore } from "../interfaces/token-family-store.interface";
import { TokenFamily } from "../types/auth-session.types";
import { redisClient } from "../../../config/redis.config";

@injectable()
export class TokenFamilyStore implements ITokenFamilyStore {
    async create(familyId: string, family: TokenFamily, ttlSeconds: number): Promise<void> {
        await redisClient.set(`auth:family:${familyId}`,JSON.stringify(family),{EX:ttlSeconds})
    }
    async findById(familyId: string): Promise<TokenFamily | null> {
        const value = await redisClient.get(`auth:family:${familyId}`)
        if(!value)  return null
        return JSON.parse(value) as TokenFamily
    }

    async deleteById(familyId: string): Promise<void> {
        await redisClient.del(`auth:family:${familyId}`)
    }

    async revokeById(familyId: string): Promise<void> {
        const key = `auth:family:${familyId}`
        const value = await redisClient.get(key)
        if(!value) return
        const family = JSON.parse(value) as TokenFamily
        family.status = "REVOKED"
        await redisClient.set(key,JSON.stringify(family),{KEEPTTL:true})
    }
}