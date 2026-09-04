import prisma from "../../../database/prisma/prisma";
import { CategoryResponseDto } from "../dtos/category-response.dto";
import { ICategoryRepository } from "../interfaces/category-repository.interface";

export class CategoryRespository implements ICategoryRepository {
    async findActiveCategories(): Promise<CategoryResponseDto[]> {
        const categories = await prisma.category.findMany({
            where:{
                status:"ACTIVE"
            },
            select:{
                id:true,
                name:true,
                slug:true,
                description:true,
                imageUrl:true,
                displayOrder:true
            },
            orderBy:{
                displayOrder:"asc"
            }
        
        })
        return categories
    }


}