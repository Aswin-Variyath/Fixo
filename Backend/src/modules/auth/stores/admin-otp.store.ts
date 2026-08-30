import { injectable } from "inversify";
import { AdminOtpData, IAdminOtpStore } from "../interfaces/admin-otp-store.interface";
import { redisClient } from "../../../config/redis.config";

@injectable()
export class AdminOtpStore implements IAdminOtpStore {
    async create(userId: string, data: AdminOtpData, ttlSeconds: number): Promise<void> {
        const key = `auth:admin-otp:${userId}`
        await redisClient.set(
            key,
            JSON.stringify(data),
            {
                EX:ttlSeconds
            }
        )
    }

    async findByUserId(userId: string): Promise<AdminOtpData | null> {
        const key = `auth:admin-otp:${userId}`
        const value = await redisClient.get(key)
        if(!value) return null
        return JSON.parse(value) as AdminOtpData
    }

    async deleteByUserId(userId: string): Promise<void> {
        const key = `auth:admin-otp:${userId}`
        await redisClient.del(key)
    }

    async incrementAttempts(userId: string): Promise<number> {
        const key  = `auth:admin-otp:${userId}`
        const value = await redisClient.get(key)
        if(!value) return 0

        const data = JSON.parse(value) as AdminOtpData

        data.attempts += 1

        await redisClient.set(
            key,
            JSON.stringify(data),
            {
                KEEPTTL:true
            }
        )
        return data.attempts
    }
}