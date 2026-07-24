export const TYPES = {
    UserRepository:Symbol.for("UserRepository"),
    UserQueryService:Symbol.for("UserQueryService"),
    UserController:Symbol.for("UserController"),
    // Auth
    PasswordService: Symbol.for("PasswordService"),
    UserAuthRepository: Symbol.for("UserAuthRepository"),
    AuthCommandService: Symbol.for("AuthCommandService"),
    AuthController:Symbol.for("AuthController"),
    // Auth token and session infrasture
    AccessTokenSerivce:Symbol.for("AccessTokenSerivce"),
    RefreshTokenService:Symbol.for("RefreshTokenService"),
    SessionStore:Symbol.for("SessionStore"),
    TokenFamilyStore:Symbol.for("TokenFamilyStore"),
    RefreshTokenStore:Symbol.for("RefreshTokenStore")
} as const