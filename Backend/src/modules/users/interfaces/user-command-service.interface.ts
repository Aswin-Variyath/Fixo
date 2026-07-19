import type {
  CreateUserDto,
} from "../dtos/create-user.dto";

import type {
  UpdateUserDto,
} from "../dtos/update-user.dto";

import type {
  UserSafeData,
} from "../types/user.types";

export interface IUserCommandService {

  createUser(
    data: CreateUserDto
  ): Promise<UserSafeData>;

  updateUser(
    id: string,
    data: UpdateUserDto
  ): Promise<UserSafeData>;

  softDeleteUser(
    id: string
  ): Promise<void>;

}