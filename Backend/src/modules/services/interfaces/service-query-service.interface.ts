import { ServiceDetailsResponseDto, ServiceSearchResponseDto } from "../dtos/service-response.dto";

export interface IserviceQueryService {
    getServices(categoryId?:string,search?:string,limit?:number,offset?:number):Promise<ServiceSearchResponseDto>
    getServiceById(serviceId:string):Promise<ServiceDetailsResponseDto>
}