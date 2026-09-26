import { NearbyTaskerLocation } from "../interfaces/tasker-query-service.interface";
import { TaskerDiscoverySort } from "./nearby-tasker.type";

export interface NearbyTaskerSearchSession {
    serviceId?: string;
    location: NearbyTaskerLocation;
    distanceKm: number;
    requestedDate?: Date;
    requestedTime?: string;
    sortBy: TaskerDiscoverySort;
}