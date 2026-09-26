import { inject, injectable } from "inversify";
import {
    ITaskerQueryService,
    NearbyTaskerLocation,
    TaskerSearchCriteria,
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
import { ITaskerAvailabilityService } from "../interfaces/tasker-availability-service.interface";

@injectable()
export class TaskerQueryService implements ITaskerQueryService {
    constructor(
        @inject(TYPES.TaskerRepository)
        private readonly taskerRepository: ITaskerRepositoy,

        @inject(TYPES.CustomerAddressRepository)
        private readonly customerAddressRepository: ICustomerAddressRepository,

        @inject(TYPES.RoutingService)
        private readonly routingService: IRoutingService,

        @inject(TYPES.TaskerAvailabilityService)
        private readonly taskerAvailabilityService: ITaskerAvailabilityService,

        @inject(TYPES.NearbyTaskerSearchStore)
        private readonly nearbyTaskerSearchStore: INearbyTaskerSearchStore,
    ) {}

    async searchTaskers(
        userId: string,
        criteria: TaskerSearchCriteria,
        searchId?: string,
        page: number = 1,
    ): Promise<NearbyTaskerSearchResponseDto> {

        /*
         * Existing search
         */
        if (searchId) {
            const taskers =
                await this.nearbyTaskerSearchStore.findById(
                    searchId
                );

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
                await this.nearbyTaskerSearchStore.findSessionById(
                    searchId
                );

            /*
             * Both result cache and metadata expired.
             */
            if (!searchSession) {
                throw new AppError(
                    StatusCodes.NOT_FOUND,
                    "Tasker search has expired",
                    undefined,
                    "TASKER_SEARCH_EXPIRED",
                );
            }

            /*
             * Rebuild the same search.
             */
            const rebuiltTaskers =
                await this.buildTaskerResults(
                    userId,
                    searchSession,
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
            !criteria.location ||
            criteria.distanceKm === undefined
        ) {
            throw new AppError(
                StatusCodes.BAD_REQUEST,
                "Location and distance are required",
            );
        }

        const eligibleTaskers =
            await this.buildTaskerResults(
                userId,
                criteria,
            );

        const newSearchId = randomUUID();

        const searchSession: NearbyTaskerSearchSession = {
            serviceId: criteria.serviceId,
            location: criteria.location,
            distanceKm: criteria.distanceKm,
            requestedDate: criteria.requestedDate,
            requestedTime: criteria.requestedTime,
            sortBy: criteria.sortBy,
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
     * Common tasker search pipeline.
     *
     * serviceId present:
     *     Service-specific nearby taskers
     *
     * serviceId absent:
     *     General tasker discovery
     */
    private async buildTaskerResults(
        userId: string,
        criteria: TaskerSearchCriteria | NearbyTaskerSearchSession,
    ): Promise<NearbyTaskerResponseDto[]> {

        const {
            latitude,
            longitude,
        } = await this.resolveCustomerLocation(
            userId,
            criteria.location,
        );

        let candidates;

        /*
         * Service-specific search
         */
        if (criteria.serviceId) {
            candidates =
                await this.taskerRepository.findNearbyTasker(
                    criteria.serviceId,
                    latitude,
                    longitude,
                    criteria.distanceKm,
                );
        }

        /*
         * General tasker discovery
         */
        else {
            candidates =
                await this.taskerRepository.findTaskerForDiscovery(
                    latitude,
                    longitude,
                    criteria.distanceKm,
                );
        }

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
        const distanceEligibleTaskers = candidates
            .map((tasker, index) => ({
                tasker,
                routing: routingResults[index],
            }))
            .filter(
                ({ tasker, routing }) =>
                    routing.distanceKm <= criteria.distanceKm &&
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

        /*
         * Availability filtering.
         *
         * Only apply this filter when the customer
         * provided both requested date and time.
         */
        if (
            criteria.requestedDate &&
            criteria.requestedTime
        ) {
            const availabilityResults =
                await Promise.all(
                    distanceEligibleTaskers.map(
                        async (tasker) => {
                            const availability =
                                await this.taskerAvailabilityService
                                    .getNextAvailableStartTime(
                                        tasker.taskerProfileId,
                                        criteria.requestedDate!,
                                        criteria.requestedTime!,
                                    );

                            return {
                                tasker,
                                available:
                                    availability.available,
                            };
                        }
                    )
                );

            return this.sortTaskers(
                availabilityResults
                    .filter(
                        ({ available }) => available
                    )
                    .map(
                        ({ tasker }) => tasker
                    ),
                criteria.sortBy,
            );
        }

        /*
         * No requested date/time.
         * Return all distance-eligible taskers.
         */
        return this.sortTaskers(
            distanceEligibleTaskers,
            criteria.sortBy,
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

        if (
            location.latitude === undefined ||
            location.longitude === undefined
        ) {
            throw new AppError(
                StatusCodes.BAD_REQUEST,
                "Customer location is required",
            );
        }

        return {
            latitude: location.latitude,
            longitude: location.longitude,
        };
    }

    /*
     * Common sorting for nearby and discovery searches.
     */
    private sortTaskers(
        taskers: NearbyTaskerResponseDto[],
        sortBy: TaskerDiscoverySort,
    ): NearbyTaskerResponseDto[] {

        switch (sortBy) {

            case "nearest":
                return taskers.sort(
                    (a, b) =>
                        a.distanceKm - b.distanceKm,
                );

            case "highestRated":
                return taskers.sort(
                    (a, b) =>
                        b.averageRating -
                        a.averageRating,
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

    /*
     * Recommendation score.
     */
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
     * Pagination for all tasker searches.
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
            taskers.slice(
                startIndex,
                endIndex,
            );

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