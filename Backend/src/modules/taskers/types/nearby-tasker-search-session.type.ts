import { NearbyTaskerLocation } from "../interfaces/tasker-query-service.interface";
import { TaskerDiscoverySort } from "./nearby-tasker.type";

export interface NearbyTaskerSearchSession {
    serviceId?: string;
    search?: string;
    taskerProfileId?: string;
    location: NearbyTaskerLocation;
    distanceKm: number;
    requestedDate?: Date;
    requestedTime?: string;
    rating?: number;
    minHourlyRate?: number;
    maxHourlyRate?: number;
    availabilityFilter?: "today" | "tomorrow" | "thisWeek";
    sortBy: TaskerDiscoverySort;
}