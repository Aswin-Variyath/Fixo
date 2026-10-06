import { inject, injectable } from "inversify";
import { TYPES } from "../../../di";
import { ITaskerRepositoy } from "../interfaces/tasker-repository.interface";
import { IserviceRepository } from "../../services/interfaces/service-repository.interface";
import { ITaskerSearchSuggestionService } from "../interfaces/tasker-search-suggestion-query-service.interface";
import { TaskerSearchSuggestionResponseDto } from "../dtos/tasker-search-suggestion-response.dto";

@injectable()
export class TaskerSearchSuggestionService implements ITaskerSearchSuggestionService {
    constructor(
        @inject(TYPES.TaskerRepository) private readonly taskerRepository:ITaskerRepositoy,
        @inject(TYPES.ServiceRepository) private readonly serviceRepository:IserviceRepository
    ) {}
    async getSuggestions(search:string,):Promise<TaskerSearchSuggestionResponseDto> {
        const searchTerm = search.trim()
        if(!searchTerm) {
            return {
                taskers:[],
                services:[]
            }
        }
        const [taskers, services] = await Promise.all([
            this.taskerRepository.findTaskerSearchSuggestions(searchTerm,3),
            this.serviceRepository.findActiveServices(undefined,searchTerm,3,0)
        ])

        return {
            taskers:taskers.map((tasker)=>({
                id:tasker.id,
                name:tasker.name
            })),
            services:services.services.map((service)=>({
                id:service.id,
                name:service.name
            }))
        }
    }
}