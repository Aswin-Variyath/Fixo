import { NearbyTasker } from "../types/nearby-tasker.type";
import { TaskerAvailabilityRecord, TaskerBlackoutRecord, TaskerBookingRecord } from "../types/tasker-availability.type";
import { TaskerSearchSuggestion } from "../types/tasker-search-suggestion.type";

export interface ITaskerRepositoy {
    findNearbyTasker(serviceId:string, latitude:number,longitude:number,distanceKm:number, rating?: number, minHourlyRate?: number,maxHourlyRate?: number,):Promise<NearbyTasker[]>
    findTaskerById(taskerProfileId: string,latitude: number,longitude: number): Promise<NearbyTasker | null>
    findTaskerForDiscovery(latitude:number,longitude:number,distanceKm:number,rating?: number,minHourlyRate?: number,maxHourlyRate?: number):Promise<NearbyTasker[]>
    findTaskerAvailability(taskerProfileId: string, bookingDate: Date): Promise<TaskerAvailabilityRecord[]>    
    findTaskerBookings(taskerProfileId:string, bookingDate:Date):Promise<TaskerBookingRecord[]>
    findTaskerBlackouts(taskerProfileId:string,bookingDate:Date):Promise<TaskerBlackoutRecord[]>
    findTaskerSearchSuggestions(search:string,limit?:number):Promise<TaskerSearchSuggestion[]>
    findTaskersBySearch(search: string,latitude: number,longitude: number,distanceKm: number,rating?: number,minHourlyRate?: number,maxHourlyRate?: number):Promise<NearbyTasker[]>
}