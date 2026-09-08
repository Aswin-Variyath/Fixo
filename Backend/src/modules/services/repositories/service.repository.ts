import { injectable } from "inversify";

import prisma from "../../../database/prisma/prisma";
import {ServiceCategoryResponseDto, ServiceResponseDto,ServiceSearchResponseDto,} from "../dtos/service-response.dto";
import { IserviceRepository } from "../interfaces/service-repository.interface";

@injectable()
export class ServiceRepository implements IserviceRepository {

    async findActiveServices(categoryId?: string,search?: string,limit?: number,offset?: number): Promise<ServiceSearchResponseDto> {

        const take = limit ?? 6;
        const skip = offset ?? 0;

        const searchWords = search
            ?.trim()
            .split(/\s+/)
            .filter(Boolean);

        const serviceWhere = {
            status: "ACTIVE" as const,
            ...(categoryId && { categoryId }),
            ...(searchWords?.length && {
                AND: searchWords.map((word) => ({
                    name: {
                        contains: word,
                        mode: "insensitive" as const,
                    },
                })),
            }),
        };

        const services = await prisma.service.findMany({
            where: serviceWhere,
            select: {
                id: true,
                categoryId: true,
                name: true,
                slug: true,
                description: true,
                displayOrder: true,
            },
            orderBy: {
                displayOrder: "asc",
            },
            skip,
            take: take + 1,
        });

        const hasMore = services.length > take;

        if (hasMore) {
            services.pop();
        }

        let categories: ServiceCategoryResponseDto[] = [];

        if (searchWords?.length) {
            categories = await prisma.category.findMany({
                where: {
                    status: "ACTIVE",
                    AND: searchWords.map((word) => ({
                        name: {
                            contains: word,
                            mode: "insensitive" as const,
                        },
                    })),
                },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    icon: true,
                    description: true,
                    displayOrder: true,
                },
                orderBy: {
                    displayOrder: "asc",
                },
            });
        }

        return {
            services: services as ServiceResponseDto[],
            categories,
            hasMore,
        };
    }
}