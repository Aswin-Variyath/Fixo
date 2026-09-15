import { inject } from "inversify";
import { ITaskerQueryService, NearbyTaskerLocation } from "../interfaces/tasker-query-service.interface";
import { TYPES } from "../../../di";
import { ITaskerRepositoy } from "../interfaces/tasker-repository.interface";
import { NearbyTasker } from "../types/nearby-tasker.type";
import { ICustomerAddressRepository } from "../../customer-addresses/interfaces/customer-address-repository.interface";
import { AppError } from "../../../shared/errors/app.error";
import { StatusCodes } from "http-status-codes";

export class TaskerQueryService implements ITaskerQueryService {
    constructor(
        @inject(TYPES.TaskerRepository) private readonly taskerRepository:ITaskerRepositoy,
        @inject(TYPES.CustomerAddressRepository) private readonly customerAddressRepository: ICustomerAddressRepository
) {}
    async findNearbyTasker(userId: string, serviceId: string, location: NearbyTaskerLocation, distanceKm: number): Promise<NearbyTasker[]> {
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
        return this.taskerRepository.findNearbyTasker(serviceId,latitude,longitude,distanceKm)
    }
}