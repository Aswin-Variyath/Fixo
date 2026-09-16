import { inject } from "inversify";
import { ITaskerQueryService, NearbyTaskerLocation } from "../interfaces/tasker-query-service.interface";
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

export class TaskerQueryService implements ITaskerQueryService {
    constructor(
        @inject(TYPES.TaskerRepository) private readonly taskerRepository:ITaskerRepositoy,
        @inject(TYPES.CustomerAddressRepository) private readonly customerAddressRepository: ICustomerAddressRepository,
        @inject(TYPES.RoutingService) private readonly routingService: IRoutingService,
        @inject(TYPES.NearbyTaskerSearchStore) private readonly nearbyTaskerSearchStore: INearbyTaskerSearchStore
) {}
    async findNearbyTasker(userId: string, serviceId?: string, location?: NearbyTaskerLocation, distanceKm?: number, searchId?: string, page: number = 1): Promise<NearbyTaskerSearchResponseDto> {
        if(searchId) {
            const taskers = await this.nearbyTaskerSearchStore.findById(searchId)
            if(!taskers) throw new AppError(StatusCodes.NOT_FOUND, "Nearby tasker search has expired", undefined, "NEARBY_TASKER_SEARCH_EXPIRED")
                return this.paginationSearchResults(searchId,taskers,page)
        }
        if(!serviceId  || !location || distanceKm === undefined) throw new AppError(StatusCodes.BAD_GATEWAY, "Invalid nearby tasker search")
        const searchServiceId = serviceId;
        const searchDistanceKm = distanceKm;
        let latitude:number
        let longitude:number
        if(location.addressId) {
            const address = await this.customerAddressRepository.findLocationByIdAndUserId(location.addressId,userId)
            if(!address) throw new AppError(StatusCodes.NOT_FOUND, "Customer address not found")
            latitude = address.latitude
            longitude = address.longitude
        }else {
            latitude = location.latitude!
            longitude = location.longitude!
        }

        const candidates = await this.taskerRepository.findNearbyTasker(searchServiceId,latitude,longitude,searchDistanceKm)

        let eligibleTaskers:NearbyTaskerResponseDto[] = []
        
        if(candidates.length > 0) {
            const routingResults = await this.routingService.getRoadDistances({
                latitude,
                longitude
            },
            candidates.map((tasker)=>({
                latitude:tasker.latitude,
                longitude:tasker.longitude
            })))

            eligibleTaskers = candidates.map((tasker,index)=>({
                tasker,
                routing:routingResults[index]
            }))
            .filter(({tasker, routing})=> routing.distanceKm <= tasker.maximumRoadDistanceKm)
            .map(({tasker,routing})=>({
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
            })).sort((a,b)=>a.distanceKm - b.distanceKm)
        }

        const newSearchId = randomUUID()

        await this.nearbyTaskerSearchStore.create(newSearchId, eligibleTaskers,ENV.REDIS.NEARBY_TASKER_SEARCH_TTL_SECONDS)
        return this.paginationSearchResults(newSearchId,eligibleTaskers,1)
    }

    private paginationSearchResults(searchId:string,taskers:NearbyTaskerResponseDto[], page:number):NearbyTaskerSearchResponseDto {
        const startIndex = (page - 1) * TASKER_SEARCH_PAGE_SIZE
        const endIndex = startIndex + TASKER_SEARCH_PAGE_SIZE
        const results = taskers.slice(startIndex,endIndex)
        const hasMore = endIndex < taskers.length
        return {searchId, page, limit:TASKER_SEARCH_PAGE_SIZE, hasMore,taskers:results}
    }
}