export interface TaskerAvailabilityRecord {
    startTime: string;
    endTime: string;
}

export interface TaskerBookingRecord {
    requestedStartTime: string;
    actualStartTime: Date | null;
    actualEndTime: Date | null;
    status: string;
}