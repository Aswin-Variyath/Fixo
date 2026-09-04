import { CategoryResponseDto } from "../dtos/category-response.dto";

export interface ICategoryRepository {
    findActiveCategories():Promise<CategoryResponseDto[]>
}