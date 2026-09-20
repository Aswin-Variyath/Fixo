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
import { TaskerDiscoverySort } from "../types/nearby-tasker.type";

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

  /*
   * Service Details → Nearby Taskers
   */
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
      const taskers =
        await this.nearbyTaskerSearchStore.findById(searchId);

      /*
       * Result cache still exists
       */
      if (taskers) {
        return this.paginationSearchResults(
          searchId,
          taskers,
          page,
        );
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
      const rebuiltTaskers =
        await this.buildNearbyTaskerResults(
          userId,
          searchSession.serviceId!,
          searchSession.location,
          searchSession.distanceKm,
          searchSession.sortBy as "recommended" | "nearest",
        );

      /*
       * Store rebuilt results using
       * the SAME searchId.
       */
      await this.nearbyTaskerSearchStore.create(
        searchId,
        rebuiltTaskers,
        searchSession,
        ENV.REDIS.NEARBY_TASKER_SEARCH_TTL_SECONDS,
        ENV.REDIS.NEARBY_TASKER_SEARCH_METADATA_TTL_SECONDS,
      );

      return this.paginationSearchResults(
        searchId,
        rebuiltTaskers,
        page,
      );
    }

    /*
     * New search
     */
    if (
      !serviceId ||
      !location ||
      distanceKm === undefined
    ) {
      throw new AppError(
        StatusCodes.BAD_GATEWAY,
        "Invalid nearby tasker search",
      );
    }

    const eligibleTaskers =
      await this.buildNearbyTaskerResults(
        userId,
        serviceId,
        location,
        distanceKm,
        sortBy,
      );

    const newSearchId = randomUUID();

    const searchSession: NearbyTaskerSearchSession = {
      serviceId,
      location,
      distanceKm,
      sortBy,
    };

    await this.nearbyTaskerSearchStore.create(
      newSearchId,
      eligibleTaskers,
      searchSession,
      ENV.REDIS.NEARBY_TASKER_SEARCH_TTL_SECONDS,
      ENV.REDIS.NEARBY_TASKER_SEARCH_METADATA_TTL_SECONDS,
    );

    return this.paginationSearchResults(
      newSearchId,
      eligibleTaskers,
      1,
    );
  }

  /*
   * Customer Home → Tasker Discovery
   */
  async discoverTaskers(
    userId: string,
    location?: NearbyTaskerLocation,
    distanceKm?: number,
    searchId?: string,
    page: number = 1,
    sortBy: TaskerDiscoverySort = "recommended",
  ): Promise<NearbyTaskerSearchResponseDto> {
    /*
     * Existing search
     */
    if (searchId) {
      const taskers =
        await this.nearbyTaskerSearchStore.findById(searchId);

      /*
       * Result cache still exists
       */
      if (taskers) {
        return this.paginationSearchResults(
          searchId,
          taskers,
          page,
        );
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
          "Tasker discovery search has expired",
          undefined,
          "TASKER_DISCOVERY_SEARCH_EXPIRED",
        );
      }

      /*
       * Rebuild the same discovery search.
       */
      const rebuiltTaskers =
        await this.buildDiscoveryTaskerResults(
          userId,
          searchSession.location,
          searchSession.distanceKm,
          searchSession.sortBy,
        );

      /*
       * Store rebuilt results using
       * the SAME searchId.
       */
      await this.nearbyTaskerSearchStore.create(
        searchId,
        rebuiltTaskers,
        searchSession,
        ENV.REDIS.NEARBY_TASKER_SEARCH_TTL_SECONDS,
        ENV.REDIS.NEARBY_TASKER_SEARCH_METADATA_TTL_SECONDS,
      );

      return this.paginationSearchResults(
        searchId,
        rebuiltTaskers,
        page,
      );
    }

    /*
     * New discovery search
     */
    if (
      !location ||
      distanceKm === undefined
    ) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Location and distance are required",
      );
    }

    const eligibleTaskers =
      await this.buildDiscoveryTaskerResults(
        userId,
        location,
        distanceKm,
        sortBy,
      );

    const newSearchId = randomUUID();

    const searchSession: NearbyTaskerSearchSession = {
      location,
      distanceKm,
      sortBy,
    };

    await this.nearbyTaskerSearchStore.create(
      newSearchId,
      eligibleTaskers,
      searchSession,
      ENV.REDIS.NEARBY_TASKER_SEARCH_TTL_SECONDS,
      ENV.REDIS.NEARBY_TASKER_SEARCH_METADATA_TTL_SECONDS,
    );

    return this.paginationSearchResults(
      newSearchId,
      eligibleTaskers,
      1,
    );
  }

  /*
   * Service-specific nearby taskers
   */
  private async buildNearbyTaskerResults(
    userId: string,
    serviceId: string,
    location: NearbyTaskerLocation,
    distanceKm: number,
    sortBy: "recommended" | "nearest",
  ): Promise<NearbyTaskerResponseDto[]> {
    const { latitude, longitude } =
      await this.resolveCustomerLocation(
        userId,
        location,
      );

    /*
     * PostGIS candidate search.
     */
    const candidates =
      await this.taskerRepository.findNearbyTasker(
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
    const routingResults =
      await this.routingService.getRoadDistances(
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
          routing.distanceKm <=
            tasker.maximumRoadDistanceKm,
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

    return this.sortTaskers(
      eligibleTaskers,
      sortBy,
    );
  }

  /*
   * All nearby taskers for Customer Home
   */
  private async buildDiscoveryTaskerResults(
    userId: string,
    location: NearbyTaskerLocation,
    distanceKm: number,
    sortBy: TaskerDiscoverySort,
  ): Promise<NearbyTaskerResponseDto[]> {
    const { latitude, longitude } =
      await this.resolveCustomerLocation(
        userId,
        location,
      );

    /*
     * PostGIS candidate search.
     *
     * Unlike service details, Home discovery
     * does not use serviceId.
     */
    const candidates =
      await this.taskerRepository.findTaskerForDiscovery(
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
    const routingResults =
      await this.routingService.getRoadDistances(
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
          routing.distanceKm <=
            tasker.maximumRoadDistanceKm,
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

    return this.sortDiscoveryTaskers(
      eligibleTaskers,
      sortBy,
    );
  }

  /*
   * Resolve customer address or GPS location.
   */
  private async resolveCustomerLocation(
    userId: string,
    location: NearbyTaskerLocation,
  ): Promise<{
    latitude: number;
    longitude: number;
  }> {
    if (location.addressId) {
      const address =
        await this.customerAddressRepository.findLocationByIdAndUserId(
          location.addressId,
          userId,
        );

      if (!address) {
        throw new AppError(
          StatusCodes.NOT_FOUND,
          "Customer address not found",
        );
      }

      return {
        latitude: address.latitude,
        longitude: address.longitude,
      };
    }

    return {
      latitude: location.latitude!,
      longitude: location.longitude!,
    };
  }

  /*
   * Existing Service Details sorting.
   */
  private sortTaskers(
    taskers: NearbyTaskerResponseDto[],
    sortBy: "recommended" | "nearest",
  ): NearbyTaskerResponseDto[] {
    if (sortBy === "nearest") {
      return taskers.sort(
        (a, b) => a.distanceKm - b.distanceKm,
      );
    }

    return taskers.sort((a, b) => {
      const scoreA =
        this.calculateRecommendationScore(a);

      const scoreB =
        this.calculateRecommendationScore(b);

      return scoreB - scoreA;
    });
  }

  /*
   * Customer Home sorting.
   */
  private sortDiscoveryTaskers(
    taskers: NearbyTaskerResponseDto[],
    sortBy: TaskerDiscoverySort,
  ): NearbyTaskerResponseDto[] {
    switch (sortBy) {
      case "nearest":
        return taskers.sort(
          (a, b) => a.distanceKm - b.distanceKm,
        );

      case "highestRated":
        return taskers.sort(
          (a, b) =>
            b.averageRating - a.averageRating,
        );

      case "lowestPrice":
        return taskers.sort((a, b) => {
          const priceA =
            a.hourlyRate ??
            a.dailyRate ??
            Number.MAX_SAFE_INTEGER;

          const priceB =
            b.hourlyRate ??
            b.dailyRate ??
            Number.MAX_SAFE_INTEGER;

          return priceA - priceB;
        });

      case "recommended":
      default:
        return taskers.sort((a, b) => {
          const scoreA =
            this.calculateRecommendationScore(a);

          const scoreB =
            this.calculateRecommendationScore(b);

          return scoreB - scoreA;
        });
    }
  }

  private calculateRecommendationScore(
    tasker: NearbyTaskerResponseDto,
  ): number {
    const distanceScore = Math.max(
      0,
      1 - tasker.distanceKm / 20,
    );

    const ratingScore =
      tasker.averageRating / 5;

    const reviewScore =
      Math.min(tasker.totalReviews / 100, 1);

    return (
      distanceScore * 0.4 +
      ratingScore * 0.4 +
      reviewScore * 0.2
    );
  }

  /*
   * Pagination for both nearby-tasker
   * and Home discovery searches.
   */
  private paginationSearchResults(
    searchId: string,
    taskers: NearbyTaskerResponseDto[],
    page: number,
  ): NearbyTaskerSearchResponseDto {
    const startIndex =
      (page - 1) * TASKER_SEARCH_PAGE_SIZE;

    const endIndex =
      startIndex + TASKER_SEARCH_PAGE_SIZE;

    const results =
      taskers.slice(startIndex, endIndex);

    const hasMore =
      endIndex < taskers.length;

    return {
      searchId,
      page,
      limit: TASKER_SEARCH_PAGE_SIZE,
      hasMore,
      taskers: results,
    };
  }
}