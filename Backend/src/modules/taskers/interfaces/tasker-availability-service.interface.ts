export interface TaskerAvailabilityWindow {
    startTime:string
    endTime:string
}
export interface TaskerAvailabilityResult {
    available: boolean;
    nextAvailableStartTime: string | null;
    windows:TaskerAvailabilityWindow[]
}

export interface ITaskerAvailabilityService {
    getNextAvailableStartTime(taskerProfileId: string, bookingDate: Date, requestedTime: string): Promise<TaskerAvailabilityResult>;
}