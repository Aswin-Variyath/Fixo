export class UnauthorizedError extends Error {
    readonly statusCode = 401
    constructor(message = "Invalid email or password") {
        super(message)
        this.name = "UnauthorizedError"
    }
}