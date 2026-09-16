import { NearbyTaskerResponseDto } from "../dtos/nearby-tasker-response.dto";

export interface INearbyTaskerSearchStore {
    create(searchId:string,taskers:NearbyTaskerResponseDto[],ttlSeconds:number):Promise<void>
    findById(searchId:string):Promise<NearbyTaskerResponseDto[] | null>
    deleteById(searchId:string):Promise<void>
}