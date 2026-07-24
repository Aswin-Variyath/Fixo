import { injectable } from "inversify";
import { IRefreshTokenStore } from "../interfaces/refresh-token-store.interface";
import { RefreshTokenRecord } from "../types/auth-session.types";
import { redisClient } from "../../../infrastructure/redis/redis.client";

@injectable()
export class RefreshTokenStore implements IRefreshTokenStore {
    async create(tokenHash: string, record: RefreshTokenRecord, ttlSeconds: number): Promise<void> {
        await redisClient.set(`auth:refresh:${tokenHash}`,JSON.stringify(record),{EX:ttlSeconds})
    }
    async findByHash(tokenHash: string): Promise<RefreshTokenRecord | null> {
        const value = await redisClient.get(`auth:refresh:${tokenHash}`)
        if(!value) return null
        return JSON.parse(value) as RefreshTokenRecord
    }
    
}