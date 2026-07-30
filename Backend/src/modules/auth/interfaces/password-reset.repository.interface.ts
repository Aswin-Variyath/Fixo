import { PasswordResetToken } from "../../../database/generated/prisma/client"
import { CreatePasswordResetTokenData, PasswordResetTokenRecord } from "../types/password-reset.types"

export interface IPasswordResetRepository {
    create(data:CreatePasswordResetTokenData): Promise<PasswordResetToken>
    findByTokenHash(tokenHash:string): Promise<PasswordResetTokenRecord  | null>
    deleteByUserId(userId:string):Promise<number>
    deleteByTokenHash(tokenHash:string):Promise<void>
}