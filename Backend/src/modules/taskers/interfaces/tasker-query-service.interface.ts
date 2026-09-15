import { NearbyTaskerResponseDto } from "../dtos/nearby-tasker-response.dto";
import { NearbyTasker } from "../types/nearby-tasker.type";

export interface NearbyTaskerLocation {
    addressId?: string
    latitude?:number
    longitude?:number
}

export interface ITaskerQueryService {
    findNearbyTasker(userId:string, serviceId:string, location:NearbyTaskerLocation, distanceKm:number):Promise<NearbyTaskerResponseDto[]>
}