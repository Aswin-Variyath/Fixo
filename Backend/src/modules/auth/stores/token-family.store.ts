import { injectable } from "inversify";
import { ITokenFamilyStore } from "../interfaces/token-family-store.interface";
import { TokenFamily } from "../types/auth-session.types";
import { redisClient } from "../../../infrastructure/redis/redis.client";

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
}