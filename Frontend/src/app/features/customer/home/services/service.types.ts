export interface Service {
    id: string;
    categoryId: string;
    name: string;
    slug: string;
    description: string;
    displayOrder: number;
}

export interface ServiceCategory {
    id: string;
    name: string;
    slug: string;
    icon: string;
    description: string | null;
    displayOrder: number;
}

export interface ServiceApiResponse {
    success: boolean;
    message: string;
    data: {
        services: Service[];
        categories: ServiceCategory[];
        hasMore: boolean;
    };
}