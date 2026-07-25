export class InvalidRefreshTokenError extends Error {
    readonly statusCode = 401;

    constructor(message = "Invalid or expired authentication session"){
        super(message)
        this.name = "InvalidRefreshTokenError"
    }
}