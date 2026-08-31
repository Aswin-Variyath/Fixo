import { inject, injectable } from "inversify";
import { AdminLoginResult, AdminVerifyOtpResult, IAuthCommandService, LoginResult, RefreshResult } from "../interfaces/auth-command-service.interface";
import { IUserAuthRespository } from "../interfaces/user-auth-repository.interface";
import {TYPES } from "../../../di"
import {  ForgotPasswordResult, SignupResult } from "../dto/auth-response.dto";
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
import { SwitchRoleResult } from "../dto/switch-role.dto";
import { IAdminOtpStore } from "../interfaces/admin-otp-store.interface";
import { AdminLoginDto } from "../dto/admin-login.dto";

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
    @inject(TYPES.AdminOtpStore) private readonly adminOtpStore: IAdminOtpStore,
) {}
    
    
    
    async signup(data: SignupDto): Promise<SignupResult> {
       const customerRole = await this.userAuthRepository.findByRoleByType("customer")
       const defaultLanguage = await this.userAuthRepository.findLanguageById("en")
       const activeStatus = await this.userAuthRepository.findStatusById("active")
       if(!customerRole || !defaultLanguage || !activeStatus) throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR,"Required signup reference data is missing")
        const existingUser = await this.userAuthRepository.findByEmail(data.email)
       if(existingUser) {
        const customerRoleExists = await this.userAuthRepository.findUserRole(existingUser.id,customerRole.id)
        if(customerRoleExists) throw new AppError(StatusCodes.CONFLICT, "User is already registered as a customer")
        await this.userAuthRepository.createUserRole(existingUser.id,customerRole.id)
        const updatedUser = await this.userAuthRepository.findUserWithRoleById(existingUser.id,customerRole.id)
        if(!updatedUser) throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR,"Failed to retrive user after adding customer role")
        const authUser = await this.userAuthRepository.findForLoginById(existingUser.id)
        if(!authUser) throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR,"Failed to initialize authentication session")
        const {accessToken, refreshToken} = await this.createAuthenticationSession(authUser,"customer")
        return {
            user:updatedUser,
            accessToken,
            refreshToken
        }
       }
       const phoneExists = await this.userAuthRepository.existsByPhone(data.phone)
       if(phoneExists) throw new AppError(StatusCodes.CONFLICT,"Phone number is already registered")
        const passwordHash = await this.passwordService.hash(data.password)
       const createdUser = await this.userAuthRepository.createSignupUser({
        firstName:data.firstName,
        lastName:data.lastName,
        email:data.email,
        phone:data.phone,
        passwordHash,
        roleId:customerRole.id,
        languageId:defaultLanguage.id,
        statusId:activeStatus.id
       })
       const authUser = await this.userAuthRepository.findForLoginById(createdUser.id)
       if(!authUser) throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR,"Failed to initialize authentication session")
        const {accessToken,refreshToken} = await this.createAuthenticationSession(authUser,"customer")
    return {
        user:createdUser,
        accessToken,
        refreshToken
    }
    }

    async login(data: LoginDto): Promise<LoginResult> {
        const user = await this.userAuthRepository.findForLogin(data.email)
        if(!user) throw new AppError(StatusCodes.UNAUTHORIZED,"Invalid email or password")
        const passwordMatches = await this.passwordService.verify(user.passwordHash,data.password)
        if(!passwordMatches) throw new AppError(StatusCodes.UNAUTHORIZED,"Invalid email or password")
        const requestedRole = user.roles.find((role)=>role.type === data.role)
        if(!requestedRole) throw new AppError(StatusCodes.FORBIDDEN,"You are not registered with this role")
        if(!user.status.isActive || user.status.type !== "active") throw new AppError(StatusCodes.FORBIDDEN,"Account access is not allowed")
        const activeRole = requestedRole.type as ActiveRole
        const {accessToken,refreshToken} = await this.createAuthenticationSession(user,activeRole)
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
                    roles:user.roles.map((role)=>({
                        type:role.type,
                        title:role.title
                    })),
                    activeRole:{
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
            familyId: currentRecord.familyId,
            newTokenExpiresAt: newExpiresAt.toISOString(),
            now: now.toISOString(),
            ttlSeconds: ENV.AUTH.TOKEN.REFRESH_TTL_SECONDS
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
                this.sessionStore.revokeById(refreshRecord.sessionId),
                this.refreshTokenStore.revokeByHash(tokenHash),
                this.tokenFamilyStore.revokeById(refreshRecord.familyId),
            ])
            
    }

    async forgotPassword(email: string): Promise<ForgotPasswordResult | null> {

        const user = await this.userAuthRepository.findByEmail(email)
        console.log("This is ",user)

        if(!user) return null 

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
        return {
            expiresAt
        }
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

    async getPasswordResetExpiry(token:string):Promise<{expiresAt:Date}> {
        const tokenHash = this.opaqueTokenService.hash(token)
        const resetToken = await this.passwordResetRepository.findByTokenHash(tokenHash)
        if(!resetToken) throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid or expired reset token")

        if(resetToken.expiresAt.getTime() < Date.now() ) {
            await this.passwordResetRepository.deleteByTokenHash(tokenHash)
            throw new AppError(StatusCodes.UNAUTHORIZED,"Invalid or expired reset token")
        }
        return {
            expiresAt: resetToken.expiresAt
        }
    }


    async taskerSignup(data: TaskerSignupDto): Promise<SignupResult> {
        const taskerRole = await this.userAuthRepository.findByRoleByType("tasker")
        const defaultLanguage = await this.userAuthRepository.findLanguageById("en")
        const activeStatus = await this.userAuthRepository.findStatusById("active")
        if(!taskerRole || !defaultLanguage || !activeStatus) throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR,"Required signup reference data is missing")
        const existingUser = await this.userAuthRepository.findByEmail(data.email)
        if(existingUser) {
            const taskerRoleExists = await this.userAuthRepository.findUserRole(existingUser.id,taskerRole.id)
            if (taskerRoleExists) throw new AppError(StatusCodes.CONFLICT,"User is already registered as a tasker")
            await this.userAuthRepository.createUserRole(existingUser.id,taskerRole.id)
            const updatedUser = await this.userAuthRepository.findUserWithRoleById(existingUser.id,taskerRole.id)
            if(!updatedUser) throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR,"Failed to retrive user after adding tasker role")
            const authUser = await this.userAuthRepository.findForLoginById(existingUser.id)
            if(!authUser) throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR,"Failed to initilalize authentication session")
            const {accessToken, refreshToken} = await this.createAuthenticationSession(authUser,"tasker")
            return {
                user:updatedUser,
                accessToken,
                refreshToken
            }
        }
        const phoneExists = await this.userAuthRepository.existsByPhone(data.phone)
        if(phoneExists) throw new AppError(StatusCodes.CONFLICT,"Phone number is already registered")
        const passwordHash = await this.passwordService.hash(data.password)
        const createdUser = await this.userAuthRepository.createSignupUser({
            firstName:data.firstName,
            lastName:data.lastName,
            email:data.email,
            phone:data.phone,
            passwordHash,
            roleId:taskerRole.id,
            languageId:defaultLanguage.id,
            statusId:activeStatus.id
        })
        const authUser = await this.userAuthRepository.findForLoginById(createdUser.id)
        if(!authUser) throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR,"Failed to initialize authentication session")
        const {accessToken,refreshToken} = await this.createAuthenticationSession(authUser,"tasker")
        return { user:createdUser, accessToken, refreshToken }
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


    private async createAuthenticationSession(user:{id:string},activeRole:ActiveRole):Promise<{accessToken:string,refreshToken:string}> {
        const sessionId = randomUUID()
        const familyId = randomUUID()
        const {token:refreshToken,tokenHash} = this.opaqueTokenService.generate()
        const now = new Date()
        const expiresAt = new Date(now.getTime() + ENV.AUTH.TOKEN.REFRESH_TTL_SECONDS * 1000)
        await this.tokenFamilyStore.create(familyId,{sessionId,status:"ACTIVE"},ENV.AUTH.TOKEN.FAMILY_TTL_SECONDS)
        await this.sessionStore.create(sessionId,{
            userId:user.id,
            activeRole,
            familyId,
            refreshTokenHash:tokenHash,
            status:"ACTIVE",
            createdAt:now.toISOString(),
            expiresAt:expiresAt.toISOString(),
            lastUsedAt:null
        },ENV.AUTH.TOKEN.SESSION_TTL_SECONDS)
        await this.refreshTokenStore.create(tokenHash,{
            sessionId,
            familyId,
            status:"ACTIVE",
            expiresAt:expiresAt.toISOString(),
            replacedByHash:null
        },ENV.AUTH.TOKEN.REFRESH_TTL_SECONDS)
        await this.sessionIndexStore.addSession(user.id,sessionId)
        const accessToken = this.accessTokenService.generate({
            userId:user.id,
            role:activeRole,
            sessionId
        })
        return {accessToken, refreshToken}
    }

   async switchRole(userId: string,sessionId: string,requestedRole: ActiveRole): Promise<SwitchRoleResult> {
    console.log("CURRENT USER ID:", userId);
    console.log("CURRENT SESSION ID:", sessionId);
    console.log("REQUESTED ROLE:", requestedRole);
    const session = await this.sessionStore.findById(sessionId);
    if (!session) throw new AppError(StatusCodes.UNAUTHORIZED,"Authentication session not found")
    if (session.status !== "ACTIVE") throw new AppError(StatusCodes.UNAUTHORIZED,"Authentication session is no longer active")
    if (session.userId !== userId) throw new AppError(StatusCodes.UNAUTHORIZED,"Invalid authentication session")
    const role = await this.userAuthRepository.findUserRoleByType(
        userId,
        requestedRole
    )
    if (!role) throw new AppError(StatusCodes.FORBIDDEN,"You are not registered with this role")
    if (!role.isActive) throw new AppError(StatusCodes.FORBIDDEN,"This role is currently inactive")
    
    await this.sessionStore.updateActiveRole(sessionId, requestedRole)

    const accessToken = this.accessTokenService.generate({userId,role: requestedRole,sessionId})

    return {accessToken,activeRole: {
                type: role.type as ActiveRole,
                title: role.title
            }
        }
    }


    async adminLogin(data: AdminLoginDto): Promise<AdminLoginResult> {
    const admin = await this.userAuthRepository.findForAdminLogin(data.email);
    if (!admin) throw new AppError(StatusCodes.UNAUTHORIZED,"Invalid email or password")  
    if (admin.deletedAt) throw new AppError(StatusCodes.UNAUTHORIZED,"Invalid email or password")
    if (!admin.status.isActive) throw new AppError(StatusCodes.FORBIDDEN,"You do not have admin access")
    if (!admin.adminRole.isSuperAdmin)throw new AppError(StatusCodes.FORBIDDEN,"You do not have admin access")
    if (!admin.adminRole.isActive) throw new AppError(StatusCodes.FORBIDDEN,"Admin role is inactive")
    const isPasswordValid = await this.passwordService.verify(admin.passwordHash, data.password)
    if (!isPasswordValid) throw new AppError(StatusCodes.UNAUTHORIZED,"Invalid email or password")
    const cooldownKey = `auth:admin-otp-cooldown:${admin.id}`
    const isCooldownActive = await this.rateLimitStore.exists(cooldownKey);
    if (isCooldownActive) throw new AppError(StatusCodes.TOO_MANY_REQUESTS,"Please wait before requesting another OTP")
    const otp = this.opaqueTokenService.generateOtp()
    const otpHash = this.opaqueTokenService.hash(otp)
    const OTP_TTL_SECONDS = 5 * 60
    const expiresAt = new Date(Date.now() + OTP_TTL_SECONDS * 1000)
    const challengeId = this.opaqueTokenService.generate().token
    await this.adminOtpStore.create(challengeId,
        {
            userId: admin.id,
            otpHash,
            attempts: 0,
            expiresAt
        },OTP_TTL_SECONDS)
    await this.mailService.sendAdminOtp(admin.email, admin.firstName, otp)
    await this.rateLimitStore.set(cooldownKey, 60)
    return {
        challengeId,
        otpExpiresIn: OTP_TTL_SECONDS,
        resendAfter: 60
        }
    }

    async verifyAdminOtp(challengeId: string, otp: string): Promise<AdminVerifyOtpResult> {
        const adminOtp = await this.adminOtpStore.findByChallengeId(challengeId);
        if (!adminOtp) throw new AppError(StatusCodes.UNAUTHORIZED,"Invalid or expired OTP")
        if (adminOtp.attempts >= 5) {
            await this.adminOtpStore.deleteByChallengeId(challengeId);
            throw new AppError(StatusCodes.TOO_MANY_REQUESTS,"Too many invalid OTP attempts")
        }
        const otpHash = this.opaqueTokenService.hash(otp);
        if (otpHash !== adminOtp.otpHash) {
            await this.adminOtpStore.incrementAttempts(challengeId)
            throw new AppError(StatusCodes.UNAUTHORIZED,"Invalid OTP")
        }

        const admin = await this.userAuthRepository.findForAdminLoginById(adminOtp.userId)
        if (!admin) throw new AppError(StatusCodes.UNAUTHORIZED,"Admin account not found")        

        const {accessToken, refreshToken} = await this.createAuthenticationSession(admin,"super_admin")

        await this.adminOtpStore.deleteByChallengeId(challengeId)
        return {
            accessToken,
            refreshToken,
            accessTokenExpiresIn:ENV.AUTH.TOKEN.ACCESS_TTL_SECONDS
        }
    }

}
