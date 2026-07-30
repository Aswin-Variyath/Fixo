import { injectable } from "inversify";
import { IsessionStore } from "../interfaces/session-store.interface";
import { AuthSession } from "../types/auth-session.types";
import { IsessionIndexStore } from "../interfaces/session-index-store.interface";
import { redisClient } from "../../../infrastructure/redis/redis.client";

@injectable()
export class SessionIndexStore implements IsessionIndexStore {
    
    private getKey(userId:string):string {
        return `auth:user-session:${userId}`
    }
    
    async addSession(userId: string, sessionId: string): Promise<void> {
        await redisClient.sAdd(this.getKey(userId),sessionId)
    }
    async removeSession(userId: string, sessionId: string): Promise<void> {
        await redisClient.sRem(this.getKey(userId),sessionId)
    }
    async getSessions(userId: string): Promise<string[]> {
        return await redisClient.sMembers(this.getKey(userId))
    }
    async deleteIndex(userId: string): Promise<void> {
        await redisClient.del(this.getKey(userId))
    }
    
    
}