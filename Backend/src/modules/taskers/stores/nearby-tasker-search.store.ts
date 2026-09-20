import { injectable } from "inversify";
import { INearbyTaskerSearchStore } from "../interfaces/nearby-tasker-search-store.interface";
import { NearbyTaskerResponseDto } from "../dtos/nearby-tasker-response.dto";
import { redisClient } from "../../../config/redis.config";
import { NearbyTaskerSearchSession } from "../types/nearby-tasker-search-session.type";

@injectable()
export class NearbyTaskerSearchStore implements INearbyTaskerSearchStore {
    async create(searchId: string, taskers: NearbyTaskerResponseDto[], session:NearbyTaskerSearchSession,resultTtlSeconds:number, metaDataTtlSeconds:number): Promise<void> {
        const resultKey = this.getResultKey(searchId)
        const sessionKey = this.getSessionKey(searchId)

        await redisClient.set(
            resultKey,
            JSON.stringify(taskers),
            {
                EX:resultTtlSeconds
            }
        )

        await redisClient.set(
            sessionKey,
            JSON.stringify(session),
            {
                EX:metaDataTtlSeconds
            }
        )

    }
    async findById(searchId: string): Promise<NearbyTaskerResponseDto[] | null> {
        const key = this.getResultKey(searchId)
        const value = await redisClient.get(key)
        if(!value) return null
        return JSON.parse(value) as NearbyTaskerResponseDto[]
    }

    async findSessionById(searchId: string): Promise<NearbyTaskerSearchSession | null> {
        const key = this.getSessionKey(searchId)
        const value = await redisClient.get(key)

        if(!value) return null

        return JSON.parse(value) as NearbyTaskerSearchSession
    }

    async deleteById(searchId: string): Promise<void> {
        await redisClient.del(this.getResultKey(searchId))
        await redisClient.del(this.getSessionKey(searchId))
    }

    private getResultKey(searchId:string):string {
        return `tasker:nearby-search:${searchId}`
    }

    private getSessionKey(searchId:string):string {
        return `tasker:nearby-search-session:${searchId}`
    }
    
}