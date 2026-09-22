export type TaskerDiscoverySort =
  | 'recommended'
  | 'nearest'
  | 'highestRated'
  | 'lowestPrice';

export interface HomeNearbyTaskerSearchCriteria {
  addressId?: string;
  latitude?: number;
  longitude?: number;
  distance: number;
  sortBy: TaskerDiscoverySort;
}

export interface HomeNearbyTaskerItem {
  taskerProfileId: string;
  userId: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  averageRating: number;
  totalReviews: number;
  hourlyRate: number | null;
  dailyRate: number | null;
  distanceKm: number;
  durationMinutes: number;
}

export interface HomeNearbyTaskerSearchData {
  searchId: string;
  page: number;
  limit: number;
  hasMore: boolean;
  taskers: HomeNearbyTaskerItem[];
}

export interface HomeNearbyTaskerSearchApiResponse {
  success: boolean;
  message: string;
  data: HomeNearbyTaskerSearchData;
}

export type HomeNearbyTaskerSectionState =
  | 'loading'
  | 'success'
  | 'empty'
  | 'location-required'
  | 'error';