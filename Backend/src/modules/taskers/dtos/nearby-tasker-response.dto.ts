export type NearbyTaskerEmptyStateReason =
    | "NO_TASKERS_NEARBY"
    | "NO_TASKERS_AVAILABLE_NOW"
    | "NO_TASKERS_AVAILABLE_TOMORROW"
    | "NO_TASKERS_AVAILABLE_THIS_WEEK"
    | "NO_TASKERS_MATCH_FILTER";

export interface NearbyTaskerEmptyState {
    reason: NearbyTaskerEmptyStateReason;
    message: string;
}

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