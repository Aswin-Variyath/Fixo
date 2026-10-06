import { TaskerSearchSuggestionResponseDto } from "../dtos/tasker-search-suggestion-response.dto";

export interface ITaskerSearchSuggestionService {
    getSuggestions(search:string):Promise<TaskerSearchSuggestionResponseDto>
}