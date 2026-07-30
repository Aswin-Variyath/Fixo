export const TYPES = {
    PrismaClient: Symbol.for("PrismaClient"),
    UserRepository:Symbol.for("UserRepository"),
    UserQueryService:Symbol.for("UserQueryService"),
    UserController:Symbol.for("UserController"),
    // Auth
    PasswordService: Symbol.for("PasswordService"),
    UserAuthRepository: Symbol.for("UserAuthRepository"),
    AuthCommandService: Symbol.for("AuthCommandService"),
    AuthController:Symbol.for("AuthController"),
    // Auth token and session infrasture
    AccessTokenService:Symbol.for("AccessTokenService"),
    OpaqueTokenService:Symbol.for("OpaqueTokenService"),
    SessionStore:Symbol.for("SessionStore"),
    TokenFamilyStore:Symbol.for("TokenFamilyStore"),
    RefreshTokenStore:Symbol.for("RefreshTokenStore"),
    AuthMiddleware:Symbol.for("AuthMiddleware"),
    AuthorizationMiddleware:Symbol.for("AuthorizationMiddleware"),
    // Password reseting 
    PasswordResetRepository: Symbol.for("PasswordResetRepository"),
    MailService: Symbol.for("MailService"),
    RateLimitStore: Symbol.for("RateLimitStore"),
    SessionIndexStore: Symbol.for("SessionIndexStore"),
} as const