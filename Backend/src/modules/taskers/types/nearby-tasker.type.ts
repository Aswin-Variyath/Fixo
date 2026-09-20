export type TaskerDiscoverySort =
    | "recommended"
    | "nearest"
    | "highestRated"
    | "lowestPrice";

export interface NearbyTasker {
    taskerProfileId: string;
    userId: string;
    firstName: string;
    lastName: string;
    profileImageUrl: string | null;
    averageRating: number;
    totalReviews: number;
    hourlyRate: number | null;
    dailyRate: number | null;
    latitude: number;
    longitude: number;
    maximumRoadDistanceKm: number;
    distanceKm: number;
    durationMinutes: number;
}