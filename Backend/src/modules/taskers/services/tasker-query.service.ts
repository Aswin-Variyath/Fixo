import { inject } from "inversify";
import { ITaskerQueryService, NearbyTaskerLocation } from "../interfaces/tasker-query-service.interface";
import { TYPES } from "../../../di";
import { ITaskerRepositoy } from "../interfaces/tasker-repository.interface";
import { NearbyTasker } from "../types/nearby-tasker.type";
import { ICustomerAddressRepository } from "../../customer-addresses/interfaces/customer-address-repository.interface";
import { AppError } from "../../../shared/errors/app.error";
import { StatusCodes } from "http-status-codes";
import { IRoutingService } from "../../../shared/providers/routing/interfaces/routing.service.interface";
import { NearbyTaskerResponseDto } from "../dtos/nearby-tasker-response.dto";

export class TaskerQueryService implements ITaskerQueryService {
    constructor(
        @inject(TYPES.TaskerRepository) private readonly taskerRepository:ITaskerRepositoy,
        @inject(TYPES.CustomerAddressRepository) private readonly customerAddressRepository: ICustomerAddressRepository,
        @inject(TYPES.RoutingService) private readonly routingService: IRoutingService
) {}
    async findNearbyTasker(userId: string, serviceId: string, location: NearbyTaskerLocation, distanceKm: number): Promise<NearbyTaskerResponseDto[]> {
        let latitude: number
        let longitude:number
        if(location.addressId) {
            const address = await this.customerAddressRepository.findLocationByIdAndUserId(location.addressId, userId)
            if(!address) throw new AppError(StatusCodes.NOT_FOUND, "Customer address not found")
            latitude = address.latitude
            longitude = address.longitude
        }else {
            latitude = location.latitude!
            longitude = location.longitude!
        }
        const candidates = await this.taskerRepository.findNearbyTasker(serviceId,latitude,longitude,distanceKm)
        if(candidates.length === 0) return []
        const routingResults = await this.routingService.getRoadDistances({latitude,longitude},
            candidates.map((tasker)=>({
                latitude:tasker.latitude,
                longitude:tasker.longitude
            }))
        )
            return candidates
            .map((tasker, index) => ({
                tasker,
                routing: routingResults[index],
            }))
            .filter(
                ({ tasker, routing }) =>
                    routing.distanceKm <=
                    tasker.maximumRoadDistanceKm
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
            })).sort((a, b) => a.distanceKm - b.distanceKm)
    }
}