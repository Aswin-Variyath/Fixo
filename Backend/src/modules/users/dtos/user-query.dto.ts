export interface UserQueryDto {
    page?: number;
    limit?: number;
    search?: string;
    role?:string;
    status?:string;
    sortBy?: "firstName" | "email" | "createdAt" | "updatedAt";
    sortOrder?: "asc" | "desc";
}