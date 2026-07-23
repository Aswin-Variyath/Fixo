export const TYPES = {
    UserRepository:Symbol.for("UserRepository"),
    UserQueryService:Symbol.for("UserQueryService"),
    UserController:Symbol.for("UserController"),
    // Auth
    PasswordService: Symbol.for("PasswordService"),
    UserAuthRepository: Symbol.for("UserAuthRepository"),
    AuthCommandService: Symbol.for("AuthCommandService"),
    AuthController:Symbol.for("AuthController")
} as const