export interface NearbyTaskerResponseDto {
    taskerProfileId: string;
    userId: string;
    firstName: string;
    lastName: string;
    profileImageUrl: string | null;
    averageRating: number;
    totalReviews: number;
    hourlyRate: number | null;
    dailyRate: number | null;
    distanceKm: number;
    durationMinutes: number;

    availability: {
    available: boolean;
    nextAvailableStartTime: string | null;
    windows: {
        startTime: string;
        endTime: string;
    }[];
    days?: {
        date: string;
        windows: {
            startTime: string;
            endTime: string;
        }[];
    }[];
} | null;
}