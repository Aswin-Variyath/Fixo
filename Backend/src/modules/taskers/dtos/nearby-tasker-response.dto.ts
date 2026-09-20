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
}