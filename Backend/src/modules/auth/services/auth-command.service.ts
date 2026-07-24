import { inject, injectable } from "inversify";
import { IAuthCommandService, LoginResult } from "../interfaces/auth-command-service.interface";
import { IUserAuthRespository } from "../interfaces/user-auth-repository.interface";
import {TYPES } from "../../../di"
import { SignupResponseDto } from "../dto/auth-response.dto";
import { SignupDto } from "../dto/signup.dto";
import { ConflictError } from "../../../shared/errors/conflict.error";
import { IPasswordService } from "../interfaces/password-service.interface";
import { LoginDto } from "../dto/login.dto";
import { UnauthorizedError } from "../../../shared/errors/unauthorized.error";
import { ForbiddenError } from "../../../shared/errors/forbidden.error";
import { randomUUID } from "node:crypto";
import { ENV } from "../../../config/env.config";
import { IRefreshTokenService } from "../interfaces/refresh-token-service.interface";
import { IsessionStore } from "../interfaces/session-store.interface";
import { ITokenFamilyStore } from "../interfaces/token-family-store.interface";
import { IRefreshTokenStore } from "../interfaces/refresh-token-store.interface";
import { IAccessTokenService } from "../interfaces/access-token-service.interface";

@injectable()
export class AuthCommandService implements IAuthCommandService {
    constructor(
    @inject(TYPES.UserAuthRepository) private readonly userAuthRepository: IUserAuthRespository, 
    @inject(TYPES.PasswordService) private readonly passwordService: IPasswordService, 
    @inject(TYPES.RefreshTokenService) private readonly refreshTokenService: IRefreshTokenService, 
    @inject(TYPES.SessionStore) private readonly sessionStore: IsessionStore, 
    @inject(TYPES.TokenFamilyStore) private readonly tokenFamilyStore:ITokenFamilyStore, 
    @inject(TYPES.RefreshTokenStore) private readonly refreshTokenStore:IRefreshTokenStore,
    @inject(TYPES.AccessTokenSerivce) private readonly accessTokenService: IAccessTokenService
) {}
    async signup(data: SignupDto): Promise<SignupResponseDto> {
        console.log("sdfljas")
        const emailExists = await this.userAuthRepository.existByEmail(data.email)
        if(emailExists) {
            throw new ConflictError("Email is alread registered")
        }
        const phoneExists = await this.userAuthRepository.existsByPhone(data.phone)
        if(phoneExists) {
            throw new ConflictError("Phone number is already registered")
        }

        const customerRole = await this.userAuthRepository.findByRoleByType("customer")
        const defaultLanguage = await this.userAuthRepository.findLanguageById("en")
        const activeStatus = await this.userAuthRepository.findStatusById("active")
        

        if(!customerRole || !defaultLanguage || !activeStatus) {
            throw new Error("Required signup reference data is missing")
        }

        const passwordHash = await this.passwordService.hash(data.password)

        return this.userAuthRepository.createSignupUser({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            passwordHash,
             roleId: customerRole.id,
             languageId: defaultLanguage.id,
             statusId:activeStatus.id
        })

    }

    async login(data: LoginDto): Promise<LoginResult> {
        console.log("Command service hits")
        const user = await this.userAuthRepository.findForLogin(data.email);
        console.log("after find by email")
        if(!user) throw new UnauthorizedError()
        const passwordMatches = await this.passwordService.verify(user.passwordHash,data.password)
        console.log("after password verify")
        if(!passwordMatches) throw new UnauthorizedError()
        if(!user.role.isActive) throw new ForbiddenError("Account access is not allowed")
        if(!user.status.isActive || user.status.type !== 'active') throw new ForbiddenError("Account access is not allowed")
        console.log("Validation completed")
        const sessionId = randomUUID()
        const familyId = randomUUID()
        console.log("Token id created")
        const {token: refreshToken, tokenHash} = this.refreshTokenService.generate()
        const now = new Date()
        const expiresAt = new Date(now.getTime() + ENV.AUTH.refreshTokenTtlSeconds * 1000)

        console.log("started session store")
        await this.sessionStore.create(sessionId,{
            userId:user.id,
            familyId,
            status:"ACTIVE",
            createdAt:now.toISOString(),
            expiresAt:expiresAt.toISOString(),
            lastUsedAt:null
        },
        ENV.AUTH.refreshTokenTtlSeconds
    )

    console.log("completed session store")

    await this.tokenFamilyStore.create(familyId,{
        sessionId,
        status:"ACTIVE",
    },
    ENV.AUTH.refreshTokenTtlSeconds
    )
    console.log("Session family created")


    await this.refreshTokenStore.create(
        tokenHash,
        {
            sessionId,
            familyId,
            status:"ACTIVE",
            expiresAt:expiresAt.toISOString(),
            replacedByHash:null
        },
        ENV.AUTH.refreshTokenTtlSeconds
    )
    console.log("Refresh token created ")
    const accessToken = this.accessTokenService.generate({
        userId:user.id,
        role:user.role.type,
        sessionId
    })
    console.log("access token completed")
    console.log("Returning result")
    return {
        accessToken,
        refreshToken,
        response: {
            accessTokenExpiresIn:ENV.JWT.accessTokenTtlSeconds,
            user:{
                id:user.id,
                firstName:user.firstName,
                lastName:user.lastName,
                email:user.email,
                phone:user.phone,
                profileImage:user.profileImage,
                role:{
                    type:user.role.type,
                    title:user.role.title
                },
                language:{
                    type:user.language.type,
                    name:user.language.name
                },
                status:{
                    type:user.status.type,
                    title:user.status.title
                }
            }
        }
    }

    }
}