export type TaskerSearchSort =
  | 'recommended'
  | 'nearest'
  | 'highestRated'
  | 'lowestPrice';

export interface TaskerSearchParams {
  serviceId?: string;
  addressId?: string;
  latitude?: number;
  longitude?: number;
  distance: number;
  requestedDate?: string;
  requestedTime?: string;
  searchId?: string;
  page?: number;
  sortBy?: TaskerSearchSort;
}

export interface TaskerSearchItem {
  taskerProfileId: string;
  userId: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string | null;
  averageRating: number;
  totalReviews: number;
  hourlyRate: number;
  dailyRate: number;
  distanceKm: number;
  durationMinutes: number;
}

export interface TaskerSearchResponse {
  searchId: string;
  page: number;
  limit: number;
  hasMore: boolean;
  taskers: TaskerSearchItem[];
}

export interface TaskerSearchApiResponse {
  success: boolean;
  message: string;
  data: TaskerSearchResponse;
}

export interface TaskerSearchPaginationParams {
  searchId: string;
  page: number;
}