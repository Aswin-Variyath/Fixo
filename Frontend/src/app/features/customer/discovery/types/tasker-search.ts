export type TaskerSearchEmptyStateReason =
  | 'NO_TASKERS_NEARBY'
  | 'NO_TASKERS_AVAILABLE_NOW'
  | 'NO_TASKERS_AVAILABLE_TOMORROW'
  | 'NO_TASKERS_AVAILABLE_THIS_WEEK'
  | 'NO_TASKERS_MATCH_FILTER';

export interface TaskerSearchEmptyState {
  reason: TaskerSearchEmptyStateReason;
  message: string;
}

export type TaskerSearchSort =
  | 'recommended'
  | 'nearest'
  | 'highestRated'
  | 'lowestPrice';

export type TaskerAvailabilityFilter =
  | 'today'
  | 'tomorrow'
  | 'thisWeek';

export interface TaskerSearchParams {
  serviceId?: string;
  search?: string;
  taskerProfileId?: string;
  addressId?: string;
  latitude?: number;
  longitude?: number;
  distance: number;
  rating?: number;
  minHourlyRate?: number;
  maxHourlyRate?: number;
  requestedDate?: string;
  requestedTime?: string;
  availabilityFilter?: TaskerAvailabilityFilter;
  searchId?: string;
  page?: number;
  sortBy?: TaskerSearchSort;
}

export interface TaskerSearchAvailabilityWindow {
  startTime: string;
  endTime: string;
}

export interface TaskerSearchAvailabilityDay {
  date: string;
  windows: TaskerSearchAvailabilityWindow[];
}

export interface TaskerSearchAvailability {
  available: boolean;
  nextAvailableStartTime: string | null;
  windows: TaskerSearchAvailabilityWindow[];
  days?: TaskerSearchAvailabilityDay[];
}

export interface TaskerSearchService {
  id: string;
  name: string;
  hourlyRate: number;
  dailyRate: number;
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
  services: TaskerSearchService[];
  availability: TaskerSearchAvailability | null;
}

export interface TaskerSearchResponse {
  searchId: string;
  page: number;
  limit: number;
  hasMore: boolean;
  taskers: TaskerSearchItem[];
  emptyState?: TaskerSearchEmptyState
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
