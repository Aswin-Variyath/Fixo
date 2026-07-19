import { injectable } from "inversify";
import prisma from "../../../database/prisma";
import type { IUserRepository } from "../interfaces/user-repository.interface";
import {
  userSafeSelect,
  type CreateUserData,
  type UpdateUserData,
  type UserListResult,
  type UserRepositoryQuery,
  type UserSafeData,
} from "../types/user.types";

import type { Prisma } from "../../../database/generated/prisma/client";

@injectable()
export class UserRepository implements IUserRepository {
  async create(data: CreateUserData): Promise<UserSafeData> {
    return prisma.user.create({ data, select: userSafeSelect });
  }

  async findById(id: string): Promise<UserSafeData | null> {
    return prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: userSafeSelect,
    });
  }

  async findByEmail(email: string): Promise<UserSafeData | null> {
    return prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
      select: userSafeSelect,
    });
  }

  async findByPhone(phone: string): Promise<UserSafeData | null> {
    return prisma.user.findFirst({
      where: {
        phone,
        deletedAt: null,
      },
      select: userSafeSelect,
    });
  }

  async findMany(query: UserRepositoryQuery): Promise<UserListResult> {
    const { skip, take, search, role, status, sortBy, sortOrder } = query;
    const where: Prisma.UserWhereInput = {
      deletedAt: null,
    };
    if (search) {
      where.OR = [
        {
          firstName: {
            contains: search,
            mode: "insensitive",
          },
        },

        {
          lastName: {
            contains: search,
            mode: "insensitive",
          },
        },

        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },

        {
          phone: {
            contains: search,
          },
        },
      ];
    }

    if (role) {
      where.role = {
        type: role,
      };
    }

    if (status) {
      where.status = {
        type: status,
      };
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,

        skip,
        take,

        orderBy: {
          [sortBy]: sortOrder,
        },

        select: userSafeSelect,
      }),

      prisma.user.count({
        where,
      }),
    ]);

    return {
      users,
      total,
    };
  }

  async update(id: string, data: UpdateUserData): Promise<UserSafeData> {
      return prisma.user.update({
        where:{
            id,
        },
        data,
        select:userSafeSelect
    })
  }

  async softDelete(id: string): Promise<void> {
      
  }
}
