import { CategoryResponseDto } from "../dtos/category-response.dto";

export interface ICategoryQueryService {
    getCategories():Promise<CategoryResponseDto[]>
}