export const successResponse = <T>(message: string,data?: T) => ({
    success: true,
    message,
    data
})