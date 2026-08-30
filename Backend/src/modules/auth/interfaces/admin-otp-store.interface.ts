export interface AdminOtpData {
    otpHash:string
    attempts:number
    expiresAt: Date
}

export interface IAdminOtpStore {
    create(userId:string,data:AdminOtpData,ttlSeconds:number):Promise<void>
    findByUserId(userId:string):Promise<AdminOtpData | null>
    deleteByUserId(userId:string):Promise<void>
    incrementAttempts(userId:string):Promise<number>

}