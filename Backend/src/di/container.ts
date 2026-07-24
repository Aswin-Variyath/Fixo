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
import { IAccessTokenService } from "../modules/auth/interfaces/access-token-service.interface";
import { AccessTokenSerivce } from "../modules/auth/services/access-token.service";
import { IRefreshTokenService } from "../modules/auth/interfaces/refresh-token-service.interface";
import { RefreshTokenService } from "../modules/auth/services/refresh-token.service";
import { IsessionStore } from "../modules/auth/interfaces/session-store.interface";
import { SessionStore } from "../modules/auth/stores/session.store";
import { ITokenFamilyStore } from "../modules/auth/interfaces/token-family-store.interface";
import { TokenFamilyStore } from "../modules/auth/stores/token-family.store";
import { IRefreshTokenStore } from "../modules/auth/interfaces/refresh-token-store.interface";
import { RefreshTokenStore } from "../modules/auth/stores/refresh-token.store";

export const container = new Container()

container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
container.bind<IUserQueryService>(TYPES.UserQueryService).to(UserQueryService).inSingletonScope();
container.bind<UserController>(TYPES.UserController).to(UserController).inSingletonScope();
container.bind<IPasswordService>(TYPES.PasswordService).to(PasswordService).inSingletonScope();
container.bind<IUserAuthRespository>(TYPES.UserAuthRepository).to(UserAuthRepository).inSingletonScope()
container.bind<IUserCommandService>(TYPES.AuthCommandService).to(AuthCommandService).inSingletonScope()
container.bind<AuthController>(TYPES.AuthController).to(AuthController).inSingletonScope();
container.bind<IAccessTokenService>(TYPES.AccessTokenSerivce).to(AccessTokenSerivce).inSingletonScope()
container.bind<IRefreshTokenService>(TYPES.RefreshTokenService).to(RefreshTokenService).inSingletonScope()
container.bind<IsessionStore>(TYPES.SessionStore).to(SessionStore).inSingletonScope()
container.bind<ITokenFamilyStore>(TYPES.TokenFamilyStore).to(TokenFamilyStore).inSingletonScope()
container.bind<IRefreshTokenStore>(TYPES.RefreshTokenStore).to(RefreshTokenStore).inSingletonScope()