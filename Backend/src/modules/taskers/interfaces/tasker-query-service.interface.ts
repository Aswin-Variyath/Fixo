import { NearbyTasker } from "../types/nearby-tasker.type";

export interface ITaskerQueryService {
    findNearbyTasker(serviceId:string, latitude:number,longitude:number,distanceKm:number):Promise<NearbyTasker[]>
}