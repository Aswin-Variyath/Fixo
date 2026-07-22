import { Container } from "inversify";
import { IUserRepository } from "../modules/users/interfaces/user-repository.interface";
import { TYPES } from "./identifiers";
import { UserRepository } from "../modules/users/repositories/user.repository";
import { UserQueryService } from "../modules/users/services/user-query.service";
import { UserController } from "../modules/users/controllers/user.controller";
import {IUserQueryService} from "../modules/users/interfaces/user-query-service.interface"

export const container = new Container()

container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope()
container.bind<IUserQueryService>(TYPES.UserQueryService).to(UserQueryService).inSingletonScope()
container.bind<UserController>(TYPES.UserController).to(UserController).inSingletonScope();