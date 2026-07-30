import { inject, injectable } from "inversify";
import { IPasswordResetRepository } from "../interfaces/password-reset.repository.interface";
import { PasswordResetToken, PrismaClient } from "../../../database/generated/prisma/client";
import { TYPES } from "../../../di";
import { CreatePasswordResetTokenData, PasswordResetTokenRecord } from "../types/password-reset.types";

@injectable()
export class PasswordResetRepository implements IPasswordResetRepository {

    constructor(@inject(TYPES.PrismaClient) private readonly prisma: PrismaClient) {}

    async create(data: CreatePasswordResetTokenData): Promise<PasswordResetToken> {
        return await this.prisma.passwordResetToken.create({data})
    }
    async findByTokenHash(tokenHash: string): Promise<PasswordResetTokenRecord  | null> {
      return this.prisma.passwordResetToken.findUnique({
        where: {
            tokenHash
        },
        include: {
            user: {
                select: {
                    email: true,
                    firstName: true
                }
            }
        }
    });
    }
    async deleteByUserId(userId: string): Promise<number> {
        const result = await this.prisma.passwordResetToken.deleteMany({
            where:{userId}
        })
        return result.count
    }
    async deleteByTokenHash(tokenHash: string): Promise<void> {
        await this.prisma.passwordResetToken.delete({where:{tokenHash}})
    }

    
}