import { injectable, named } from "inversify";
import { IserviceRepository } from "../interfaces/service-repository.interface";
import { ServiceResponseDto } from "../dtos/service-response.dto";
import prisma from "../../../database/prisma/prisma";

@injectable()
export class ServiceRespository implements IserviceRepository {
    async findActiveServices(categoryId?: string, search?: string, limit?: number, offset?: number): Promise<{ services: ServiceResponseDto[]; hasMore: boolean; }> {
        const where = {
            status: "ACTIVE" as const,
            ...(categoryId && {
                categoryId,
            }),
            ...(search && {
                name:{
                    contains:search,
                    mode:"insensitive" as const
                }
            })

            
        }
        const take = limit ?? 6;
        const skip = offset ?? 0
        
        const services = await prisma.service.findMany({
            where,
            select:{
                id:true,
                categoryId:true,
                name:true,
                slug:true,
                description:true,
                imageUrl:true,
                displayOrder:true
            },
            orderBy:{
                displayOrder:'asc'
            },
            skip,
            take:take + 1
        })
        const hasMore = services.length > take
        if(hasMore) services.pop()

        return {
            services,
            hasMore
        }
    }
}