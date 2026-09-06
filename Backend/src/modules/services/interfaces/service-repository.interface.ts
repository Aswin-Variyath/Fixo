import { ServiceResponseDto } from "../../services/dtos/service-response.dto";

export interface IserviceRepository {
    findActiveServices(categoryId?:string,search?:string,limit?:number,offset?:number):Promise<{services:ServiceResponseDto[]; hasMore:boolean}>
}