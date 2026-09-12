import { ServiceDetailsResponseDto, ServiceSearchResponseDto } from "../../services/dtos/service-response.dto";

export interface IserviceRepository {
    findActiveServices(categoryId?:string,search?:string,limit?:number,offset?:number):Promise<ServiceSearchResponseDto>
    findActiveServiceById(serviceId:string):Promise<ServiceDetailsResponseDto | null>
}