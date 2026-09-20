import { inject } from "inversify";
import {
  ITaskerQueryService,
  NearbyTaskerLocation,
} from "../interfaces/tasker-query-service.interface";
import { TYPES } from "../../../di";
import { ITaskerRepositoy } from "../interfaces/tasker-repository.interface";
import { ICustomerAddressRepository } from "../../customer-addresses/interfaces/customer-address-repository.interface";
import { AppError } from "../../../shared/errors/app.error";
import { StatusCodes } from "http-status-codes";
import { IRoutingService } from "../../../shared/providers/routing/interfaces/routing.service.interface";
import { NearbyTaskerResponseDto } from "../dtos/nearby-tasker-response.dto";
import { INearbyTaskerSearchStore } from "../interfaces/nearby-tasker-search-store.interface";
import { randomUUID } from "node:crypto";
import { ENV } from "../../../config/env.config";
import { TASKER_SEARCH_PAGE_SIZE } from "../constants/tasker.constants";
import { NearbyTaskerSearchResponseDto } from "../dtos/nearby-tasker-search-response.dto";
import { NearbyTaskerSearchSession } from "../types/nearby-tasker-search-session.type";

export class TaskerQueryService implements ITaskerQueryService {
  constructor(
    @inject(TYPES.TaskerRepository)
    private readonly taskerRepository: ITaskerRepositoy,

    @inject(TYPES.CustomerAddressRepository)
    private readonly customerAddressRepository: ICustomerAddressRepository,

    @inject(TYPES.RoutingService)
    private readonly routingService: IRoutingService,

    @inject(TYPES.NearbyTaskerSearchStore)
    private readonly nearbyTaskerSearchStore: INearbyTaskerSearchStore,
  ) {}

  async findNearbyTasker(
    userId: string,
    serviceId?: string,
    location?: NearbyTaskerLocation,
    distanceKm?: number,
    searchId?: string,
    page: number = 1,
    sortBy: "recommended" | "nearest" = "recommended",
  ): Promise<NearbyTaskerSearchResponseDto> {
    /*
     * Existing search
     */
    if (searchId) {
      const taskers = await this.nearbyTaskerSearchStore.findById(searchId);

      /*
       * Result cache still exists
       */
      if (taskers) {
        return this.paginationSearchResults(searchId, taskers, page);
      }

      /*
       * Result cache expired.
       * Try to recover the search using metadata.
       */
      const searchSession =
        await this.nearbyTaskerSearchStore.findSessionById(searchId);

      /*
       * Both result cache and metadata expired.
       */
      if (!searchSession) {
        throw new AppError(
          StatusCodes.NOT_FOUND,
          "Nearby tasker search has expired",
          undefined,
          "NEARBY_TASKER_SEARCH_EXPIRED",
        );
      }

      /*
       * Rebuild the same search.
       */
      const rebuiltTaskers = await this.buildNearbyTaskerResults(
        userId,
        searchSession.serviceId,
        searchSession.location,
        searchSession.distanceKm,
        searchSession.sortBy,
      );

      /*
       * Store the rebuilt results using
       * the SAME searchId.
       */
      await this.nearbyTaskerSearchStore.create(
        searchId,
        rebuiltTaskers,
        searchSession,
        ENV.REDIS.NEARBY_TASKER_SEARCH_TTL_SECONDS,
        ENV.REDIS.NEARBY_TASKER_SEARCH_METADATA_TTL_SECONDS,
      );

      return this.paginationSearchResults(searchId, rebuiltTaskers, page);
    }

    /*
     * New search
     */
    if (!serviceId || !location || distanceKm === undefined) {
      throw new AppError(
        StatusCodes.BAD_GATEWAY,
        "Invalid nearby tasker search",
      );
    }

    const searchServiceId = serviceId;
    const searchDistanceKm = distanceKm;

    const eligibleTaskers = await this.buildNearbyTaskerResults(
      userId,
      searchServiceId,
      location,
      searchDistanceKm,
      sortBy,
    );

    const newSearchId = randomUUID();

    const searchSession: NearbyTaskerSearchSession = {
      serviceId: searchServiceId,
      location,
      distanceKm: searchDistanceKm,
      sortBy,
    };

    await this.nearbyTaskerSearchStore.create(
      newSearchId,
      eligibleTaskers,
      searchSession,
      ENV.REDIS.NEARBY_TASKER_SEARCH_TTL_SECONDS,
      ENV.REDIS.NEARBY_TASKER_SEARCH_METADATA_TTL_SECONDS,
    );

    return this.paginationSearchResults(newSearchId, eligibleTaskers, 1);
  }

  private async buildNearbyTaskerResults(
    userId: string,
    serviceId: string,
    location: NearbyTaskerLocation,
    distanceKm: number,
    sortBy: "recommended" | "nearest",
  ): Promise<NearbyTaskerResponseDto[]> {
    let latitude: number;
    let longitude: number;

    /*
     * Resolve customer location.
     */
    if (location.addressId) {
      const address =
        await this.customerAddressRepository.findLocationByIdAndUserId(
          location.addressId,
          userId,
        );

      if (!address) {
        throw new AppError(StatusCodes.NOT_FOUND, "Customer address not found");
      }

      latitude = address.latitude;
      longitude = address.longitude;
    } else {
      latitude = location.latitude!;
      longitude = location.longitude!;
    }

    /*
     * PostGIS candidate search.
     */
    const candidates = await this.taskerRepository.findNearbyTasker(
      serviceId,
      latitude,
      longitude,
      distanceKm,
    );

    if (candidates.length === 0) {
      return [];
    }

    /*
     * OSRM road distance calculation.
     */
    const routingResults = await this.routingService.getRoadDistances(
      {
        latitude,
        longitude,
      },
      candidates.map((tasker) => ({
        latitude: tasker.latitude,
        longitude: tasker.longitude,
      })),
    );

    /*
     * Road-distance eligibility.
     */
    const eligibleTaskers = candidates
      .map((tasker, index) => ({
        tasker,
        routing: routingResults[index],
      }))
      .filter(
        ({ tasker, routing }) =>
          routing.distanceKm <= distanceKm &&
          routing.distanceKm <= tasker.maximumRoadDistanceKm,
      )
      .map(({ tasker, routing }) => ({
        taskerProfileId: tasker.taskerProfileId,

        userId: tasker.userId,

        firstName: tasker.firstName,

        lastName: tasker.lastName,

        profileImageUrl: tasker.profileImageUrl,

        averageRating: tasker.averageRating,

        totalReviews: tasker.totalReviews,

        hourlyRate: tasker.hourlyRate,

        dailyRate: tasker.dailyRate,

        distanceKm: routing.distanceKm,

        durationMinutes: routing.durationMinutes,
      }));

    /*
     * Apply requested sorting.
     */
    return this.sortTaskers(eligibleTaskers, sortBy);
  }

  private sortTaskers(
    taskers: NearbyTaskerResponseDto[],
    sortBy: "recommended" | "nearest",
  ): NearbyTaskerResponseDto[] {
    if (sortBy === "nearest") {
      return taskers.sort((a, b) => a.distanceKm - b.distanceKm);
    }

    return taskers.sort((a, b) => {
      const scoreA = this.calculateRecommendationScore(a);

      const scoreB = this.calculateRecommendationScore(b);

      return scoreB - scoreA;
    });
  }

  private calculateRecommendationScore(
    tasker: NearbyTaskerResponseDto,
  ): number {
    const distanceScore = Math.max(0, 1 - tasker.distanceKm / 20);

    const ratingScore = tasker.averageRating / 5;

    const reviewScore = Math.min(tasker.totalReviews / 100, 1);

    return distanceScore * 0.4 + ratingScore * 0.4 + reviewScore * 0.2;
  }

  private paginationSearchResults(
    searchId: string,
    taskers: NearbyTaskerResponseDto[],
    page: number,
  ): NearbyTaskerSearchResponseDto {
    const startIndex = (page - 1) * TASKER_SEARCH_PAGE_SIZE;

    const endIndex = startIndex + TASKER_SEARCH_PAGE_SIZE;

    const results = taskers.slice(startIndex, endIndex);

    const hasMore = endIndex < taskers.length;

    return {
      searchId,
      page,
      limit: TASKER_SEARCH_PAGE_SIZE,
      hasMore,
      taskers: results,
    };
  }
}
