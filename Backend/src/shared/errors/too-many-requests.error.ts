
export class TooManyRequestError extends Error  {
    readonly statusCode = 429
    constructor(message = "Too many request. Please try again later") {
        super(message)
        this.name = "TooManyRequestError"
    }

} 