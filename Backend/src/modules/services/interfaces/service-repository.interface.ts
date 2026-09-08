import { ServiceSearchResponseDto } from "../../services/dtos/service-response.dto";

export interface IserviceRepository {
    findActiveServices(categoryId?:string,search?:string,limit?:number,offset?:number):Promise<ServiceSearchResponseDto>
}