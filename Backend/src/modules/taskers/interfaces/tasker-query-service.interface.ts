import { NearbyTaskerResponseDto } from "../dtos/nearby-tasker-response.dto";
import { NearbyTaskerSearchResponseDto } from "../dtos/nearby-tasker-search-response.dto";
import { NearbyTasker } from "../types/nearby-tasker.type";

export interface NearbyTaskerLocation {
    addressId?: string
    latitude?:number
    longitude?:number
}

export interface ITaskerQueryService {
    findNearbyTasker(userId:string, serviceId?:string, location?:NearbyTaskerLocation, distanceKm?:number, searchId?: string, page?: number):Promise<NearbyTaskerSearchResponseDto>
}