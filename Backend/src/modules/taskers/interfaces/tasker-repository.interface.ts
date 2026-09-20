import { NearbyTasker } from "../types/nearby-tasker.type";

export interface ITaskerRepositoy {
    findNearbyTasker(serviceId:string, latitude:number,longitude:number,distanceKm:number):Promise<NearbyTasker[]>
}