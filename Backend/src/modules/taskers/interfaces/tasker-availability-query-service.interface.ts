export interface TaskerAvailabilityWindow {
    startTime:string
    endTime:string
}
export interface TaskerAvailabilityResult {
    available: boolean;
    nextAvailableStartTime: string | null;
    windows:TaskerAvailabilityWindow[]
}

export interface TaskerAvailabilityDay {
    date: string;
    windows: TaskerAvailabilityWindow[];
}

export interface TaskerWeeklyAvailabilityResult {
    available: boolean;
    nextAvailableStartTime: string | null;
    days: TaskerAvailabilityDay[];
}

export interface ITaskerAvailabilityService {
    getNextAvailableStartTime(taskerProfileId: string, bookingDate: Date, requestedTime?: string): Promise<TaskerAvailabilityResult>;
     getWeeklyAvailability(taskerProfileId: string,startDate: Date,): Promise<TaskerWeeklyAvailabilityResult>;
}