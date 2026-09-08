import { inject, injectable } from "inversify";
import { IserviceQueryService } from "../interfaces/service-query-service.interface";
import { TYPES } from "../../../di";
import { IserviceRepository } from "../interfaces/service-repository.interface";
import { ServiceSearchResponseDto } from "../dtos/service-response.dto";

@injectable()
export class ServiceQueryService implements IserviceQueryService {
    constructor(@inject(TYPES.ServiceRepository) private readonly serviceRepository:IserviceRepository) {}

    async getServices(categoryId?: string, search?: string, limit?: number, offset?: number): Promise<ServiceSearchResponseDto> {
        return await this.serviceRepository.findActiveServices(categoryId,search,limit,offset)
    }
}