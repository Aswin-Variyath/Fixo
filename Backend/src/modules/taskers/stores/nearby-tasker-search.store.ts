import { injectable } from "inversify";
import { INearbyTaskerSearchStore } from "../interfaces/nearby-tasker-search-store.interface";
import { NearbyTaskerResponseDto } from "../dtos/nearby-tasker-response.dto";
import { redisClient } from "../../../config/redis.config";

@injectable()
export class NearbyTaskerSearchStore implements INearbyTaskerSearchStore {
    async create(searchId: string, taskers: NearbyTaskerResponseDto[], ttlSeconds: number): Promise<void> {
        const key = this.getKey(searchId)
        await redisClient.set(key,
            JSON.stringify(taskers),
            {
                EX:ttlSeconds
            }
        )
    }
    async findById(searchId: string): Promise<NearbyTaskerResponseDto[] | null> {
        const key = this.getKey(searchId)
        const value = await redisClient.get(key)
        if(!value) return null
        return JSON.parse(value) as NearbyTaskerResponseDto[]
    }
    async deleteById(searchId: string): Promise<void> {
        await redisClient.del(this.getKey(searchId))
    }

    private getKey(searchId:string):string {
        return `tasker:nearby-search:${searchId}`
    }
    
}