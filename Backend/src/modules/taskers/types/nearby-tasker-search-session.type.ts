import { NearbyTaskerLocation } from "../interfaces/tasker-query-service.interface";

export interface NearbyTaskerSearchSession {
    serviceId: string;
    location: NearbyTaskerLocation;
    distanceKm: number;
    sortBy: "recommended" | "nearest";
}