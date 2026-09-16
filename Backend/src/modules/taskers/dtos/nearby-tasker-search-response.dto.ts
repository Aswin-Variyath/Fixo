import { NearbyTaskerResponseDto } from "./nearby-tasker-response.dto";

export interface NearbyTaskerSearchResponseDto {
    searchId: string;
    page: number;
    limit: number;
    hasMore: boolean;
    taskers: NearbyTaskerResponseDto[];
}