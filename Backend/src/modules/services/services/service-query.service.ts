import { inject, injectable } from "inversify";
import { IserviceQueryService } from "../interfaces/service-query-service.interface";
import { TYPES } from "../../../di";
import { IserviceRepository } from "../interfaces/service-repository.interface";
import { ServiceDetailsResponseDto, ServiceSearchResponseDto } from "../dtos/service-response.dto";
import { AppError } from "../../../shared/errors/app.error";
import { StatusCodes } from "http-status-codes";

@injectable()
export class ServiceQueryService implements IserviceQueryService {
    constructor(@inject(TYPES.ServiceRepository) private readonly serviceRepository:IserviceRepository) {}

    async getServices(categoryId?: string, search?: string, limit?: number, offset?: number): Promise<ServiceSearchResponseDto> {
        return await this.serviceRepository.findActiveServices(categoryId,search,limit,offset)
    }
    
    async getServiceById(serviceId: string): Promise<ServiceDetailsResponseDto> {
        const service = await this.serviceRepository.findActiveServiceById(serviceId)
        if(!service) throw new AppError(StatusCodes.NOT_FOUND,"Service not found")
        return service
    }
}