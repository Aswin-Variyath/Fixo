export class ForbiddenError extends Error {
    readonly statusCode = 403
    constructor(message = "Account access is not allowed") {
        super(message)

        this.message = "ForbiddenError"
    }
}