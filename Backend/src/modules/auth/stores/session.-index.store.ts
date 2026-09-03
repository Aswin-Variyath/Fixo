import { injectable } from "inversify";
import { IsessionIndexStore } from "../interfaces/session-index-store.interface";
import { redisClient } from "../../../config/redis.config";
import { ENV } from "../../../config/env.config";

@injectable()
export class SessionIndexStore implements IsessionIndexStore {
    
    private getKey(userId:string):string {
        return `auth:user-session:${userId}`
    }
    
    async addSession(userId: string, sessionId: string): Promise<void> {
        const key = this.getKey(userId)
        await redisClient.sAdd(key,sessionId)
        await redisClient.expire(key,ENV.AUTH.TOKEN.USER_SESSION_TTL_SECONDS)
    }
    async removeSession(userId: string, sessionId: string): Promise<void> {
        const key = this.getKey(userId)
        await redisClient.sRem(key,sessionId)
        const remainingSession = await redisClient.sCard(key)
        if(remainingSession === 0) await redisClient.del(key)
    }
    async getSessions(userId: string): Promise<string[]> {
        return await redisClient.sMembers(this.getKey(userId))
    }
    async deleteIndex(userId: string): Promise<void> {
        await redisClient.del(this.getKey(userId))
    }
    
    
}