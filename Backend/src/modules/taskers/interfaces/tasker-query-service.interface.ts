import { NearbyTaskerResponseDto } from "../dtos/nearby-tasker-response.dto";
import { NearbyTaskerSearchResponseDto } from "../dtos/nearby-tasker-search-response.dto";
import { TaskerDiscoverySort } from "../types/nearby-tasker.type";

export interface NearbyTaskerLocation {
    addressId?: string
    latitude?:number
    longitude?:number
}

export interface ITaskerQueryService {
    findNearbyTasker(userId:string, serviceId?:string, location?:NearbyTaskerLocation, distanceKm?:number, searchId?: string, page?: number, sortBy?: 'recommended' | 'nearest'):Promise<NearbyTaskerSearchResponseDto>
    discoverTaskers(userId:string, location?:NearbyTaskerLocation, distanceKm?:number,searchId?:string,page?:number,sortBy?:TaskerDiscoverySort):Promise<NearbyTaskerSearchResponseDto>

}