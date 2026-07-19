import type {
  PaginatedUsers,
  UserSafeData,
} from "../types/user.types";

import type {
  UserQueryDto,
} from "../dtos/user-query.dto";

export interface IUserQueryService {
  listUsers(query: UserQueryDto): Promise<PaginatedUsers>;

  getUserDetails(id: string): Promise<UserSafeData>;
}