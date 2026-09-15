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
import { AccessTokenService } from "../modules/auth/services/access-token.service";
import { IOpaqueTokenService } from "../modules/auth/interfaces/opaque_token_service.interface";
import { OpaqueTokenService } from "../modules/auth/services/opaque-token.service";
import { IsessionStore } from "../modules/auth/interfaces/session-store.interface";
import { SessionStore } from "../modules/auth/stores/session.store";
import { ITokenFamilyStore } from "../modules/auth/interfaces/token-family-store.interface";
import { TokenFamilyStore } from "../modules/auth/stores/token-family.store";
import { IRefreshTokenStore } from "../modules/auth/interfaces/refresh-token-store.interface";
import { RefreshTokenStore } from "../modules/auth/stores/refresh-token.store";
import { IAuthMiddleWare } from "../modules/auth/interfaces/auth-middleware.interface";
import { AuthMiddleware } from "../shared/middlewares/auth.middleware";
import { IAuthorizationMiddleware } from "../modules/auth/interfaces/authoriazation-middleware.interface";
import { AuthorizationMiddleware } from "../shared/middlewares/authorization.middleware";
import { PrismaClient } from "@prisma/client/extension";
import prisma from "../database/prisma/prisma";
import { IPasswordResetRepository } from "../modules/auth/interfaces/password-reset.repository.interface";
import { PasswordResetRepository } from "../modules/auth/repositories/password-reset.repository";
import { IRateLimitStore } from "../modules/auth/interfaces/rate-limit-store.interface";
import { RateLimitStore } from "../modules/auth/stores/rate-limit.store";
import { IsessionIndexStore } from "../modules/auth/interfaces/session-index-store.interface";
import { SessionIndexStore } from "../modules/auth/stores/session.-index.store";
import { IMailService } from "../shared/providers/mail/interfaces/mail.service.interface";
import { NodemailerMailService } from "../shared/providers/mail/services/resend-mail.service";
import { IAdminOtpStore } from "../modules/auth/interfaces/admin-otp-store.interface";
import { AdminOtpStore } from "../modules/auth/stores/admin-otp.store";
import { ICategoryQueryService } from "../modules/categories/interfaces/category-query-service.interface";
import { CategoryQueryService } from "../modules/categories/services/category-query.service";
import { ICategoryRepository } from "../modules/categories/interfaces/category-repository.interface";
import { CategoryRespository } from "../modules/categories/repositories/category.repository";
import { CategoryController } from "../modules/categories/controllers/category.controller";
import { IserviceRepository } from "../modules/services/interfaces/service-repository.interface";
import { ServiceRepository } from "../modules/services/repositories/service.repository";
import { IserviceQueryService } from "../modules/services/interfaces/service-query-service.interface";
import { ServiceQueryService } from "../modules/services/services/service-query.service";
import { ServiceController } from "../modules/services/controllers/service.controller";
import { ITaskerRepositoy } from "../modules/taskers/interfaces/tasker-repository.interface";
import { TaskerRepository } from "../modules/taskers/repositories/tasker.repository";
import { ITaskerQueryService } from "../modules/taskers/interfaces/tasker-query-service.interface";
import { TaskerQueryService } from "../modules/taskers/services/tasker-query.service";
import { TaskerController } from "../modules/taskers/controllers/tasker.controller";
import { ICustomerAddressRepository } from "../modules/customer-addresses/interfaces/customer-address-repository.interface";
import { CustomerAddressRepository } from "../modules/customer-addresses/repositories/customer-address.repository";
import { IRoutingService } from "../shared/providers/routing/interfaces/routing.service.interface";
import { OsrmRoutingService } from "../shared/providers/routing/services/osrm-routing.service";

export const container = new Container()

container.bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(prisma)
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
container.bind<IUserQueryService>(TYPES.UserQueryService).to(UserQueryService).inSingletonScope();
container.bind<UserController>(TYPES.UserController).to(UserController).inSingletonScope();
container.bind<IPasswordService>(TYPES.PasswordService).to(PasswordService).inSingletonScope();
container.bind<IUserAuthRespository>(TYPES.UserAuthRepository).to(UserAuthRepository).inSingletonScope()
container.bind<IUserCommandService>(TYPES.AuthCommandService).to(AuthCommandService).inSingletonScope()
container.bind<AuthController>(TYPES.AuthController).to(AuthController).inSingletonScope();
container.bind<IAccessTokenService>(TYPES.AccessTokenService).to(AccessTokenService).inSingletonScope()
container.bind<IOpaqueTokenService>(TYPES.OpaqueTokenService).to(OpaqueTokenService).inSingletonScope()
container.bind<IsessionStore>(TYPES.SessionStore).to(SessionStore).inSingletonScope()
container.bind<ITokenFamilyStore>(TYPES.TokenFamilyStore).to(TokenFamilyStore).inSingletonScope()
container.bind<IRefreshTokenStore>(TYPES.RefreshTokenStore).to(RefreshTokenStore).inSingletonScope()
container.bind<IAuthMiddleWare>(TYPES.AuthMiddleware).to(AuthMiddleware).inSingletonScope()
container.bind<IAuthorizationMiddleware>(TYPES.AuthorizationMiddleware).to(AuthorizationMiddleware).inSingletonScope()
container.bind<IPasswordResetRepository>(TYPES.PasswordResetRepository).to(PasswordResetRepository).inSingletonScope()
container.bind<IMailService>(TYPES.MailService).to(NodemailerMailService).inSingletonScope()
container.bind<IRateLimitStore>(TYPES.RateLimitStore).to(RateLimitStore).inSingletonScope()
container.bind<IsessionIndexStore>(TYPES.SessionIndexStore).to(SessionIndexStore).inSingletonScope()
container.bind<IAdminOtpStore>(TYPES.AdminOtpStore).to(AdminOtpStore).inSingletonScope()
container.bind<ICategoryQueryService>(TYPES.CategoryQueryService).to(CategoryQueryService).inSingletonScope()
container.bind<ICategoryRepository>(TYPES.CategoryRespository).to(CategoryRespository).inSingletonScope()
container.bind<CategoryController>(TYPES.CategoryController).to(CategoryController).inSingletonScope()
container.bind<IserviceRepository>(TYPES.ServiceRepository).to(ServiceRepository).inSingletonScope()
container.bind<IserviceQueryService>(TYPES.ServiceQueryService).to(ServiceQueryService).inSingletonScope()
container.bind<ServiceController>(TYPES.ServiceController).to(ServiceController).inSingletonScope()
container.bind<ITaskerRepositoy>(TYPES.TaskerRepository).to(TaskerRepository).inSingletonScope()
container.bind<ITaskerQueryService>(TYPES.TaskerQueryService).to(TaskerQueryService).inSingletonScope()
container.bind<TaskerController>(TYPES.TaskerController).to(TaskerController).inSingletonScope()
container.bind<ICustomerAddressRepository>(TYPES.CustomerAddressRepository).to(CustomerAddressRepository).inSingletonScope()
container.bind<IRoutingService>(TYPES.RoutingService).to(OsrmRoutingService).inSingletonScope()