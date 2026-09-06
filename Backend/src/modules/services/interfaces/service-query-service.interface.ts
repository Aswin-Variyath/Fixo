import { ServiceResponseDto } from "../dtos/service-response.dto";

export interface IserviceQueryService {
    getServices(categoryId?:string,search?:string,limit?:number,offset?:number):Promise<{services:ServiceResponseDto[]; hasMore:boolean}>
}