import { injectable } from "inversify";
import {AdminOtpData,IAdminOtpStore} from "../interfaces/admin-otp-store.interface";
import { redisClient } from "../../../config/redis.config";

@injectable()
export class AdminOtpStore implements IAdminOtpStore {

    async create(challengeId: string,data: AdminOtpData, ttlSeconds: number): Promise<void> {
        const key = `auth:admin-otp:${challengeId}`;
        await redisClient.set(
            key,
            JSON.stringify(data),
            {EX: ttlSeconds}
        )
    }

    async findByChallengeId(challengeId: string): Promise<AdminOtpData | null> {
        const key = `auth:admin-otp:${challengeId}`;
        const value = await redisClient.get(key);
        if (!value) return null;
        return JSON.parse(value) as AdminOtpData;
    }

    async deleteByChallengeId(challengeId: string): Promise<void> {
        const key = `auth:admin-otp:${challengeId}`;
        await redisClient.del(key);
    }

    async incrementAttempts(challengeId: string): Promise<number> {
        const key = `auth:admin-otp:${challengeId}`;
        const value = await redisClient.get(key);
        if (!value) return 0;
        const data = JSON.parse(value) as AdminOtpData;
        data.attempts += 1;
        await redisClient.set(
            key,
            JSON.stringify(data),
            {KEEPTTL: true}
        )
        return data.attempts;
    }
}