export interface TaskerAvailabilityResult {
    available: boolean;
    nextAvailableStartTime: string | null;
}

export interface ITaskerAvailabilityService {
    getNextAvailableStartTime(taskerProfileId: string, bookingDate: Date, requestedTime: string): Promise<TaskerAvailabilityResult>;
}