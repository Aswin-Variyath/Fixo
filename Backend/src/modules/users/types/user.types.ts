import type { Prisma } from "../../../database/generated/prisma/client";

export const userSafeSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  profileImage: true,

  role: {
    select: {
      id: true,
      type: true,
      title: true,
      isSuper: true,
    },
  },

  language: {
    select: {
      id: true,
      type: true,
      name: true,
    },
  },

  status: {
    select: {
      id: true,
      type: true,
      title: true,
      colorCode: true,
    },
  },

  lastLogin: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export type UserSafeData = Prisma.UserGetPayload<{
  select: typeof userSafeSelect;
}>;

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  profileImage?: string | null;
  roleId: string;
  languageId: string;
  statusId: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  profileImage?: string | null;
  roleId?: string;
  languageId?: string;
  statusId?: string;
}

export interface UserRepositoryQuery {
    skip: number;
    take: number;
    search?: string;
    role?:string;
    status?:string;
    sortBy: "firstName" | "email" | "createdAt" | "updatedAt";
    sortOrder: "asc" | "desc"
}

export interface UserListResult {
    users: UserSafeData[]
    total: number
}


export interface UserPagination {
    page: number;
    limit: number;
    total: number;
    totalPages:number;
}

export interface PaginatedUsers {
    users: UserSafeData[]
    pagination: UserPagination
}
