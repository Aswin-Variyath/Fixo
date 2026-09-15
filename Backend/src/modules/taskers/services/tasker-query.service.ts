import { inject } from "inversify";
import { ITaskerQueryService } from "../interfaces/tasker-query-service.interface";
import { TYPES } from "../../../di";
import { ITaskerRepositoy } from "../interfaces/tasker-repository.interface";
import { NearbyTasker } from "../types/nearby-tasker.type";

export class TaskerQueryService implements ITaskerQueryService {
    constructor(@inject(TYPES.TaskerRepository) private readonly taskerRepository:ITaskerRepositoy) {}
    async findNearbyTasker(serviceId: string, latitude: number, longitude: number, distanceKm: number): Promise<NearbyTasker[]> {
        return this.taskerRepository.findNearbyTasker(serviceId,latitude,longitude,distanceKm)
    }
}