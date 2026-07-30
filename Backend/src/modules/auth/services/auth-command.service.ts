import { inject, injectable } from "inversify";
import { IAuthCommandService, LoginResult, RefreshResult } from "../interfaces/auth-command-service.interface";
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
import { IOpaqueTokenService } from "../interfaces/opaque_token_service.interface";
import { IsessionStore } from "../interfaces/session-store.interface";
import { ITokenFamilyStore } from "../interfaces/token-family-store.interface";
import { IRefreshTokenStore } from "../interfaces/refresh-token-store.interface";
import { IAccessTokenService } from "../interfaces/access-token-service.interface";
import { InvalidRefreshTokenError } from "../../../shared/errors/invalid-refresh-token.error";
import { IPasswordResetRepository } from "../interfaces/password-reset.repository.interface";
import { IMailService } from "../../../services/mail/interfaces/mail.service.interface";
import { IRateLimitStore } from "../interfaces/rate-limit-store.interface";
import { TooManyRequestError } from "../../../shared/errors/too-many-requests.error";
import { IsessionIndexStore } from "../interfaces/session-index-store.interface";
import { ResetPasswordDto } from "../dto/reset-password.dto";

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
        const {token: refreshToken, tokenHash} = this.opaqueTokenService.generate()
        const now = new Date()
        const expiresAt = new Date(now.getTime() + ENV.AUTH.refreshTokenTtlSeconds * 1000)

        console.log("started session store")
        await this.sessionStore.create(sessionId,{
            userId:user.id,
            familyId,
            refreshTokenHash: tokenHash,
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
await this.sessionIndexStore.addSession(user.id,sessionId)
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
    async refresh(refreshToken: string): Promise<RefreshResult> {
        const currentTokenHash =  this.opaqueTokenService.hash(refreshToken)

        const currentRecord = await this.refreshTokenStore.findByHash(currentTokenHash)

        if(!currentRecord) throw new InvalidRefreshTokenError()


        const session = await this.sessionStore.findById(currentRecord.sessionId)

        if(!session || session.status !== "ACTIVE") {
            throw new InvalidRefreshTokenError()
        }

        const user = await this.userAuthRepository.findByIdForAuth(session.userId)

        if(!user || user.deletedAt || !user.role.isActive || !user.status.isActive || user.status.type !== "active") {
            throw new InvalidRefreshTokenError()
        }

        const {token:newRefreshToken, tokenHash: newTokenHash} = this.opaqueTokenService.generate()

        const now = new Date()

        const newExpiresAt = new Date(now.getTime() + ENV.AUTH.refreshTokenTtlSeconds * 1000)

        const rotationResult = await this.refreshTokenStore.rotate({
            currentTokenHash,
            newTokenHash,
            sessionId: currentRecord.sessionId,
            familyId:currentRecord.familyId,
            newTokenExpiresAt:newExpiresAt.toISOString(),
            ttlSeconds:ENV.AUTH.refreshTokenTtlSeconds
        })

        if(rotationResult.status  !== "ROTATED") {
            if(rotationResult.status === "TOKEN_REUSED") {
                console.warn("Refresh token reuse detected",{
                    sessionId:currentRecord.sessionId,
                    familyId:currentRecord.familyId
                })
            }
            throw new InvalidRefreshTokenError()
        }

        const accessToken = this.accessTokenService.generate({
            userId:user.id,
            role: user.role.type,
            sessionId:currentRecord.sessionId
        })

        return {
            accessToken,refreshToken: newRefreshToken, accessTokenExpiresIn: ENV.JWT.accessTokenTtlSeconds
        }

    }

    async logout(refreshToken: string): Promise<void> {
        const tokenHash = this.opaqueTokenService.hash(refreshToken)

        const refreshRecord = await this.refreshTokenStore.findByHash(tokenHash)

        if(!refreshRecord) throw new InvalidRefreshTokenError()

            const session = await this.sessionStore.findById(refreshRecord.sessionId)
            if(session) {
                await this.sessionIndexStore.removeSession(session.userId,refreshRecord.sessionId)
            }

            await Promise.all([
                this.sessionStore.deleteById(refreshRecord.sessionId),
                this.refreshTokenStore.deleteByHash(tokenHash),
                this.tokenFamilyStore.deleteById(refreshRecord.familyId),
            ])
            console.log("Logour completd");
            
    }

    async forgotPassword(email: string): Promise<void> {

        const user = await this.userAuthRepository.findByEmail(email)

        if(!user) return

        const rateLimitKey = `auth:rate-limit:forgot-password:${email}`

        const isLimited = await this.rateLimitStore.exists(rateLimitKey)

        if(isLimited) throw new TooManyRequestError("Please wait before requesting another password reset email.")



        await this.passwordResetRepository.deleteByUserId(user.id)

        const {token, tokenHash} = this.opaqueTokenService.generate()

        const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

        await this.passwordResetRepository.create({
            userId: user.id,
            tokenHash,
            expiresAt,
            
        })

        await this.mailService.sendPasswordResetEmail(user.email,user.firstName,token)
        await this.rateLimitStore.set(rateLimitKey, 300)
    }

    async resetPassword(data: ResetPasswordDto): Promise<void> {
        const tokenHash = this.opaqueTokenService.hash(data.token)

        const resetToken = await this.passwordResetRepository.findByTokenHash(tokenHash)

        if(!resetToken) throw new UnauthorizedError("Invalid or expired reset token")

        if(resetToken.expiresAt.getTime() < Date.now()) {
            await this.passwordResetRepository.deleteByTokenHash(tokenHash)
            throw new UnauthorizedError("Invalid or expired reset token")

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


}
