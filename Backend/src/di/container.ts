import { Container } from "inversify";

import { TYPES } from "./identifiers";

import type { IUserRepository } from "../modules/users/interfaces/user-repository.interface";
import type { IUserQueryService } from "../modules/users/interfaces/user-query-service.interface";
import type { IUserCommandService } from "../modules/users/interfaces/user-command-service.interface";

import { UserRepository } from "../modules/users/repositories/user.repository";
import { UserQueryService } from "../modules/users/services/user-query.service";
import { UserCommandService } from "../modules/users/services/user-command.service";
import { UserController } from "../modules/users/controllers/user.controller";

export const container = new Container();

container
  .bind<IUserRepository>(TYPES.UserRepository)
  .to(UserRepository)
  .inSingletonScope();

container
  .bind<IUserQueryService>(TYPES.UserQueryService)
  .to(UserQueryService)
  .inSingletonScope();

container
  .bind<IUserCommandService>(TYPES.UserCommandService)
  .to(UserCommandService)
  .inSingletonScope();

  container
  .bind<UserController>(TYPES.UserController)
  .to(UserController)
  .inSingletonScope();