import { inject, injectable } from "inversify";
import { IUserQueryService } from "../interfaces/user-query-service.interface";
import { IUserRepository } from "../interfaces/user-repository.interface";
import { TYPES } from "../../../di";
import { UserQueryDto } from "../dtos/user-query.dto";
import {
  UserListResult,
  UserSafeData,
  PaginatedUsers,
} from "../types/user.types";
import { NotFoundError } from "../../../shared/errors/not-found.error";

@injectable()
export class UserQueryService implements IUserQueryService {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async listUsers(query: UserQueryDto): Promise<PaginatedUsers> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const skip = (page - 1) * limit;

    const result = await this.userRepository.findMany({
      skip,
      take: limit,

      search: query.search,
      role: query.role,
      status: query.status,

      sortBy: query.sortBy ?? "createdAt",
      sortOrder: query.sortOrder ?? "desc",
    });

    const totalPages = Math.ceil(result.total / limit);

    return {
      users: result.users,

      pagination: {
        page,
        limit,
        total: result.total,
        totalPages,
      },
    };
  }

  async getUserDetails(id: string): Promise<UserSafeData> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  }
}
