import { NearbyTaskerResponseDto } from "../dtos/nearby-tasker-response.dto";
import { NearbyTaskerSearchResponseDto } from "../dtos/nearby-tasker-search-response.dto";
import { NearbyTaskerSearchSession } from "../types/nearby-tasker-search-session.type";

export interface INearbyTaskerSearchStore {
    create(searchId:string,taskers:NearbyTaskerResponseDto[],session:NearbyTaskerSearchSession, resultTtlSeconds:number,metaDataTtlSeconds:number):Promise<void>
    findById(searchId:string):Promise<NearbyTaskerResponseDto[] | null>
    findSessionById(searchId:string):Promise<NearbyTaskerSearchSession | null>
    deleteById(searchId:string):Promise<void>
}