import { NearbyTaskerResponseDto } from "../dtos/nearby-tasker-response.dto";
import { NearbyTaskerSearchResponseDto } from "../dtos/nearby-tasker-search-response.dto";
import { TaskerDiscoverySort } from "../types/nearby-tasker.type";

export interface NearbyTaskerLocation {
    addressId?: string
    latitude?:number
    longitude?:number
}

export type TaskerAvailabilityFilter =
    | "today"
    | "tomorrow"
    | "thisWeek";

export interface TaskerSearchCriteria {
    serviceId?: string;
    search?: string;
    taskerProfileId?: string;
    location: NearbyTaskerLocation;
    distanceKm: number;
    rating?: number;
    minHourlyRate?: number;
    maxHourlyRate?: number;
    requestedDate?: Date;
    requestedTime?: string;
    availabilityFilter?: TaskerAvailabilityFilter;
    sortBy: TaskerDiscoverySort;
}

export interface ITaskerQueryService {
    searchTaskers(userId: string, criteria: TaskerSearchCriteria, searchId?: string, page?: number): Promise<NearbyTaskerSearchResponseDto>;
}