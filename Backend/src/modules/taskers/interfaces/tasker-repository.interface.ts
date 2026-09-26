import { NearbyTasker } from "../types/nearby-tasker.type";
import { TaskerAvailabilityRecord, TaskerBookingRecord } from "../types/tasker-availability.type";

export interface ITaskerRepositoy {
    findNearbyTasker(serviceId:string, latitude:number,longitude:number,distanceKm:number):Promise<NearbyTasker[]>
    findTaskerForDiscovery(latitude:number,longitude:number,distanceKm:number):Promise<NearbyTasker[]>
    findTaskerAvailability(taskerProfileId:string,dayOfWeek:string):Promise<TaskerAvailabilityRecord[]>
    findTaskerBookings(taskerProfileId:string, bookingDate:Date):Promise<TaskerBookingRecord[]>
}