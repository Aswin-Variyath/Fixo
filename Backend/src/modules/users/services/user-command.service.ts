import {
  inject,
  injectable,
} from "inversify";


import { TYPES } from "../../../di/identifiers";

import type {
  IUserRepository,
} from "../interfaces/user-repository.interface";

import type {
  IUserCommandService,
} from "../interfaces/user-command-service.interface";

import type {
  CreateUserDto,
} from "../dtos/create-user.dto";

import type {
  UpdateUserDto,
} from "../dtos/update-user.dto";

import type {
  UserSafeData,
} from "../types/user.types";




@injectable()
export class UserCommandService
  implements IUserCommandService {}