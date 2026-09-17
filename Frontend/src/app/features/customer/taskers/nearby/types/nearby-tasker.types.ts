export interface NearbyTaskerSearchCriteria {
    serviceId:string
    addressId?: string
    latitude?:number
    longitude?:number
    distance:number
}

export interface NearbyTaskerItem  {
    taskerProfileId:string
    userId:string
    firstName:string
    lastName:string
    profileImageUrl:string
    averageRating:number
    totalReviews:number
    hourlyRate:number | null
    dailyRate:number | null
    distanceKm:number
    durationMinutes:number
}

export interface NearbyTaskerSearchData  {
    searchId:string
    page:number
    limit:number
    hasMore:boolean
    taskers:NearbyTaskerItem []
}

export interface NearbyTaskerSearchApiResponse {
    success:boolean
    message:string
    data:NearbyTaskerSearchData
}

export interface NearbyTaskerApiError  {
    success:boolean
    message:string
    code?:string
    details?:unknown
}

export type TaskerSectionState =
  | 'loading'
  | 'success'
  | 'empty'
  | 'location-required'
  | 'error'

  

