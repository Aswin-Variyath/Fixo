import { inject, injectable } from "inversify";
import { IAuthCommandService, LoginResult, RefreshResult } from "../interfaces/auth-command-service.interface";
import { IUserAuthRespository } from "../interfaces/user-auth-repository.interface";
import {TYPES } from "../../../di"
import { SignupResponseDto } from "../dto/auth-response.dto";
import { SignupDto } from "../dto/signup.dto";
import { IPasswordService } from "../interfaces/password-service.interface";
import { LoginDto } from "../dto/login.dto";
import { randomUUID } from "node:crypto";
import { ENV } from "../../../config/env.config";
import { IOpaqueTokenService } from "../interfaces/opaque_token_service.interface";
import { IsessionStore } from "../interfaces/session-store.interface";
import { ITokenFamilyStore } from "../interfaces/token-family-store.interface";
import { IRefreshTokenStore } from "../interfaces/refresh-token-store.interface";
import { IAccessTokenService } from "../interfaces/access-token-service.interface";
import { IPasswordResetRepository } from "../interfaces/password-reset.repository.interface";
import { IRateLimitStore } from "../interfaces/rate-limit-store.interface";
import { IsessionIndexStore } from "../interfaces/session-index-store.interface";
import { ResetPasswordDto } from "../dto/reset-password.dto";
import { IMailService } from "../../../shared/providers/mail/interfaces/mail.service.interface";
import { AppError } from "../../../shared/errors/app.error";
import { StatusCodes } from "http-status-codes";
import { ActiveRole } from "../types/auth-session.types";
import { TaskerSignupDto } from "../dto/tasker-signup.dt0";
import { ta } from "zod/v4/locales";

@injectable()
export class AuthCommandService implements IAuthCommandService {
    constructor(
    @inject(TYPES.UserAuthRepository) private readonly userAuthRepository: IUserAuthRespository, 
    @inject(TYPES.PasswordService) private readonly passwordService: IPasswordService, 
    @inject(TYPES.OpaqueTokenService) private readonly opaqueTokenService: IOpaqueTokenService, 
    @inject(TYPES.SessionStore) private readonly sessionStore: IsessionStore, 
    @inject(TYPES.TokenFamilyStore) private readonly tokenFamilyStore:ITokenFamilyStore, 
    @inject(TYPES.RefreshTokenStore) private readonly refreshTokenStore:IRefreshTokenStore,
    @inject(TYPES.AccessTokenService) private readonly accessTokenService: IAccessTokenService,
    @inject(TYPES.PasswordResetRepository) private readonly passwordResetRepository: IPasswordResetRepository,
    @inject(TYPES.MailService) private readonly mailService: IMailService,
    @inject(TYPES.RateLimitStore) private readonly rateLimitStore: IRateLimitStore,
    @inject(TYPES.SessionIndexStore) private readonly sessionIndexStore: IsessionIndexStore,
) {}
    
    
    
    async signup(data: SignupDto): Promise<SignupResponseDto> {
        const emailExists = await this.userAuthRepository.existByEmail(data.email)
        if(emailExists) {
            throw new AppError(StatusCodes.CONFLICT, "Email is already registered")
        }
        const phoneExists = await this.userAuthRepository.existsByPhone(data.phone)
        if(phoneExists) {
            throw new AppError(StatusCodes.CONFLICT, "Phone number is already registered")
        }

        const customerRole = await this.userAuthRepository.findByRoleByType("customer")
        const defaultLanguage = await this.userAuthRepository.findLanguageById("en")
        const activeStatus = await this.userAuthRepository.findStatusById("active")
        

        if(!customerRole || !defaultLanguage || !activeStatus) {
            throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "Required signup reference data is missing")
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
        const user = await this.userAuthRepository.findForLogin(data.email)
        if(!user) throw new AppError(StatusCodes.UNAUTHORIZED,"Invalid email or password")
        const passwordMatches = await this.passwordService.verify(user.passwordHash,data.password)
        if(!passwordMatches) throw new AppError(StatusCodes.UNAUTHORIZED,"Invalid email or password")
        const requestedRole = user.roles.find((role)=>role.type === data.role)
        if(!requestedRole) throw new AppError(StatusCodes.FORBIDDEN,"You are not registered with this role")
        if(!user.status.isActive || user.status.type !== "active") throw new AppError(StatusCodes.FORBIDDEN,"Account access is not allowed")
        const sessionId = randomUUID()
        const familyId = randomUUID()
        const {token:refreshToken,tokenHash} = this.opaqueTokenService.generate()
        const now = new Date()
        const expiresAt = new Date(now.getTime() + ENV.AUTH.TOKEN.REFRESH_TTL_SECONDS * 1000)
        const activeRole = requestedRole.type as ActiveRole
        await this.sessionStore.create(sessionId,{
            userId:user.id,
            activeRole,
            familyId,
            refreshTokenHash:tokenHash,
            status:"ACTIVE",
            createdAt:now.toISOString(),
            expiresAt:expiresAt.toISOString(),
            lastUsedAt:null
        },ENV.AUTH.TOKEN.REFRESH_TTL_SECONDS)
        await this.refreshTokenStore.create(
            tokenHash,{
                sessionId,
                familyId,
                status:"ACTIVE",
                expiresAt:expiresAt.toISOString(),
                replacedByHash:null,
            },ENV.AUTH.TOKEN.REFRESH_TTL_SECONDS)
        await this.sessionIndexStore.addSession(user.id, sessionId)
        const accessToken = this.accessTokenService.generate({
            userId:user.id,
            role:requestedRole.type,
            sessionId
        })
        return {
            accessToken,
            refreshToken,
            response: {
                accessTokenExpiresIn: ENV.AUTH.TOKEN.ACCESS_TTL_SECONDS,
                user: {
                    id:user.id,
                    firstName:user.firstName,
                    lastName:user.lastName,
                    email:user.email,
                    phone:user.phone,
                    profileImage:user.profileImage,
                    role:{
                        type:requestedRole.type,
                        title:requestedRole.title
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
    async refresh(refreshToken: string): Promise<RefreshResult> {
        const currentTokenHash =  this.opaqueTokenService.hash(refreshToken)

        const currentRecord = await this.refreshTokenStore.findByHash(currentTokenHash)

        if(!currentRecord) throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid or expired authentication session")


        const session = await this.sessionStore.findById(currentRecord.sessionId)

        if(!session || session.status !== "ACTIVE") {
            throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid or expired authentication session")
        }

        const user = await this.userAuthRepository.findByIdForAuth(session.userId)

        if(!user || user.deletedAt ||  !user.status.isActive || user.status.type !== "active") {
            throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid or expired authentication session")
        }

        const activeRole = user.roles.find((role)=>role.type === session.activeRole)

        if(!activeRole || !activeRole.isActive) throw new AppError(StatusCodes.UNAUTHORIZED,"Inavlid or expired authentication session")

        const {token:newRefreshToken, tokenHash: newTokenHash} = this.opaqueTokenService.generate()

        const now = new Date()

        const newExpiresAt = new Date(now.getTime() + ENV.AUTH.TOKEN.REFRESH_TTL_SECONDS * 1000)

        const rotationResult = await this.refreshTokenStore.rotate({
            currentTokenHash,
            newTokenHash,
            sessionId: currentRecord.sessionId,
            familyId:currentRecord.familyId,
            newTokenExpiresAt:newExpiresAt.toISOString(),
            ttlSeconds:ENV.AUTH.TOKEN.REFRESH_TTL_SECONDS
        })

        if(rotationResult.status  !== "ROTATED") {
            if(rotationResult.status === "TOKEN_REUSED") {
                console.warn("Refresh token reuse detected",{
                    sessionId:currentRecord.sessionId,
                    familyId:currentRecord.familyId
                })
            }
            throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid or expired authentication session")
        }

        const accessToken = this.accessTokenService.generate({
            userId:user.id,
            role: session.activeRole,
            sessionId:currentRecord.sessionId
        })

        return {
            accessToken,refreshToken: newRefreshToken, accessTokenExpiresIn: ENV.AUTH.TOKEN.ACCESS_TTL_SECONDS
        }

    }

    async logout(refreshToken: string): Promise<void> {
        const tokenHash = this.opaqueTokenService.hash(refreshToken)

        const refreshRecord = await this.refreshTokenStore.findByHash(tokenHash)

        if(!refreshRecord) throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid or expired authentication session")

            const session = await this.sessionStore.findById(refreshRecord.sessionId)
            if(session) {
                await this.sessionIndexStore.removeSession(session.userId,refreshRecord.sessionId)
            }

            await Promise.all([
                this.sessionStore.deleteById(refreshRecord.sessionId),
                this.refreshTokenStore.deleteByHash(tokenHash),
                this.tokenFamilyStore.deleteById(refreshRecord.familyId),
            ])
            
    }

    async forgotPassword(email: string): Promise<void> {

        const user = await this.userAuthRepository.findByEmail(email)
        console.log("This is ",user)

        if(!user) return

        const rateLimitKey = `auth:rate-limit:forgot-password:${email}`

        const isLimited = await this.rateLimitStore.exists(rateLimitKey)

        if(isLimited) throw new AppError(StatusCodes.TOO_MANY_REQUESTS,"Please wait before requesting another password reset email.")



        await this.passwordResetRepository.deleteByUserId(user.id)

        const {token, tokenHash} = this.opaqueTokenService.generate()

        const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

        await this.passwordResetRepository.create({
            userId: user.id,
            tokenHash,
            expiresAt,
            
        })

        let maili = await this.mailService.sendPasswordResetEmail(user.email,user.firstName,token)
        console.log("this is a,il",maili)
        await this.rateLimitStore.set(rateLimitKey, 300)
    }

    async resetPassword(data: ResetPasswordDto): Promise<void> {
        const tokenHash = this.opaqueTokenService.hash(data.token)

        const resetToken = await this.passwordResetRepository.findByTokenHash(tokenHash)

        if(!resetToken) throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid or expired reset token")

        if(resetToken.expiresAt.getTime() < Date.now()) {
            await this.passwordResetRepository.deleteByTokenHash(tokenHash)
            throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid or expired reset token")

        }

        const passwordHash = await this.passwordService.hash(data.password)

        await this.userAuthRepository.updatePassword(resetToken.userId,passwordHash)

        try {
            const sessionIds = await this.sessionIndexStore.getSessions(resetToken.userId)

            for(const sessionId of sessionIds) {
                const session = await this.sessionStore.findById(sessionId)

                if(!session) continue

                await Promise.all([
                    this.sessionStore.deleteById(sessionId),
                    this.refreshTokenStore.deleteByHash(session.refreshTokenHash),
                    this.tokenFamilyStore.deleteById(session.familyId),

                ])
            }
            await this.sessionIndexStore.deleteIndex(resetToken.userId)
            try{
                await this.mailService.sendPasswordChangeEmail(resetToken.user.email, resetToken.user.firstName)

            }catch(error) {
                console.error("failed to send password change email")
            }

        }finally {
            await this.passwordResetRepository.deleteByTokenHash(tokenHash)
        }
    }


    async taskerSignup(data: TaskerSignupDto): Promise<SignupResponseDto> {
        const emailExists = await this.userAuthRepository.existByEmail(data.email)
        if(emailExists) throw new AppError(StatusCodes.CONFLICT,"Email is already registered")
        const phoneExists = await this.userAuthRepository.existByEmail(data.phone)
        if(phoneExists) throw new AppError(StatusCodes.CONFLICT,"Phone number is already registered")
        const taskerRole = await this.userAuthRepository.findByRoleByType("tasker")
        const defaultLanguage = await this.userAuthRepository.findLanguageById("en")
        const activeStatus = await this.userAuthRepository.findStatusById("active")
        if(!taskerRole || !defaultLanguage || !activeStatus) throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "Required signup reference data is missing")

        const passwordHash = await this.passwordService.hash(data.password)
        return this.userAuthRepository.createSignupUser({
            firstName:data.firstName,
            lastName:data.lastName,
            email:data.email,
            phone:data.phone,
            passwordHash,
            roleId:taskerRole.id,
            languageId:defaultLanguage.id,
            statusId:activeStatus.id
        })
    }

    async becomeTasker(userId:string):Promise<void> {
        const taskerRole = await this.userAuthRepository.findByRoleByType("tasker")
        if(!taskerRole) throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "Tasker role is not available")

        const alreadyTasker = await this.userAuthRepository.findUserRole(userId,taskerRole.id)
        if(alreadyTasker) throw new AppError(StatusCodes.CONFLICT,"User is already registered as a tasker")

        await this.userAuthRepository.createUserRole(userId,taskerRole.id)
    }

    async becomeCustomer(userId: string): Promise<void> {
        const customerRole = await this.userAuthRepository.findByRoleByType("customer")
        if(!customerRole) throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "Customer role is not available")

        const alreadyCustomer = await this.userAuthRepository.findUserRole(userId,customerRole.id)
        if(alreadyCustomer) throw new AppError(StatusCodes.CONFLICT, "User is already registered as a customer")

        await this.userAuthRepository.createUserRole(userId,customerRole.id)
    }
}
