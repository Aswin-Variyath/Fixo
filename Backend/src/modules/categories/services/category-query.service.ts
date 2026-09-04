import { inject, injectable } from "inversify";
import { ICategoryQueryService } from "../interfaces/category-query-service.interface";
import { TYPES } from "../../../di";
import { ICategoryRepository } from "../interfaces/category-repository.interface";
import { CategoryResponseDto } from "../dtos/category-response.dto";

@injectable()
export class CategoryQueryService implements ICategoryQueryService {
    constructor(@inject(TYPES.CategoryRespository) private readonly categoryRespository:ICategoryRepository) {}
    async getCategories(): Promise<CategoryResponseDto[]> {
        return await this.categoryRespository.findActiveCategories();
    }
}