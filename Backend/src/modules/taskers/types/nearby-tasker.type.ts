export interface NearbyTasker {
    taskerProfileId:string
    userId:string
    firsName:string
    lastName:string
    profileImageUrl:string | null
    averageRating:number
    totalReviews:number
    hourlyRate:number | null
    dailyRate:number | null
    distanceKm: number
}