import { injectable } from "inversify";
import { IsessionStore } from "../interfaces/session-store.interface";
import { AuthSession } from "../types/auth-session.types";
import { redisClient } from "../../../config/redis.config";

@injectable()
export class SessionStore implements IsessionStore {
    async create(sessionId: string, session: AuthSession, ttlSecond: number): Promise<void> {
        const key = `auth:session:${sessionId}`
        await redisClient.set(key, JSON.stringify(session),{EX:ttlSecond})
    }
    async findById(sessionId: string): Promise<AuthSession | null> {
        const value = await redisClient.get(`auth:session:${sessionId}`)
        if(!value) {
            return null
        }
        return JSON.parse(value) as AuthSession
    }
    async deleteById(sessionId:string):Promise<void> {
        console.log("THisis sessionid", sessionId)
        const key = `auth:session:${sessionId}`;

const value = await redisClient.get(key);

console.log("Session Key:", key);
console.log("Session Value:", value);
    const deleted = await redisClient.del(`auth:session:${sessionId}`)
    console.log("Deleted Count:", deleted);
  }
}