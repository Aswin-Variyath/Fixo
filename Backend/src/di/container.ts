import { Container } from "inversify";
import { IUserRepository } from "../modules/users/interfaces/user-repository.interface";
import { TYPES } from "./identifiers";
import { UserRepository } from "../modules/users/repositories/user.repository";
import { UserQueryService } from "../modules/users/services/user-query.service";
import { UserController } from "../modules/users/controllers/user.controller";
import {IUserQueryService} from "../modules/users/interfaces/user-query-service.interface"
import { IPasswordService } from "../modules/auth/interfaces/password-service.interface";
import { PasswordService } from "../modules/auth/services/password.service";
import { IUserCommandService } from "../modules/users/interfaces/user-command-service.interface";
import { AuthCommandService } from "../modules/auth/services/auth-command.service";
import { AuthController } from "../modules/auth/controllers/auth.controller";
import { IUserAuthRespository } from "../modules/auth/interfaces/user-auth-repository.interface";
import { UserAuthRepository } from "../modules/auth/repositories/user-auth.repository";

export const container = new Container()

container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
container.bind<IUserQueryService>(TYPES.UserQueryService).to(UserQueryService).inSingletonScope();
container.bind<UserController>(TYPES.UserController).to(UserController).inSingletonScope();
container.bind<IPasswordService>(TYPES.PasswordService).to(PasswordService).inSingletonScope();
container.bind<IUserAuthRespository>(TYPES.UserAuthRepository).to(UserAuthRepository).inSingletonScope()
container.bind<IUserCommandService>(TYPES.AuthCommandService).to(AuthCommandService).inSingletonScope()
container.bind<AuthController>(TYPES.AuthController).to(AuthController).inSingletonScope();