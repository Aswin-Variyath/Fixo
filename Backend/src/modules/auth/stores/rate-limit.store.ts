import { inject, injectable } from "inversify";
import { IRateLimitStore } from "../interfaces/rate-limit-store.interface";
import { redisClient } from "../../../config/redis.config";

@injectable()
export class RateLimitStore implements IRateLimitStore {
    async exists(key: string): Promise<boolean> {
        const exists = await redisClient.exists(key)
        return exists === 1
    }
    async set(key: string, ttlSeconds: number): Promise<void> {
        await redisClient.set(key,"1",{EX:ttlSeconds})
    }
    async delete(key: string): Promise<void> {
        await redisClient.del(key)
    }
    
}