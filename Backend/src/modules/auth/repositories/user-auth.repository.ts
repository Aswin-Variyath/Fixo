import { inject, injectable } from "inversify";
import prisma from "../../../database/prisma/prisma";
import { SignupResponseDto } from "../dto/auth-response.dto";
import { AuthReferenceRecord, CreateSignupUserData, IUserAuthRespository, LoginUserRecord, RefreshAuthUserRecord, userRoleRecord } from "../interfaces/user-auth-repository.interface";
import { TYPES } from "../../../di";
import { PrismaClient, User } from "../../../database/generated/prisma/client";
import { email } from "zod";
import { profile } from "node:console";
import { ActiveRole } from "../types/auth-session.types";
import { SwitchRoleResult } from "../dto/switch-role.dto";

@injectable()
export class UserAuthRepository implements IUserAuthRespository {
   
    constructor(@inject(TYPES.PrismaClient) private readonly prisma: PrismaClient) {}
 
    async existByEmail(email: string): Promise<Boolean> {
        const user = await prisma.user.findUnique({where:{email},select:{id:true}})
        return user != null
    }
    async existsByPhone(phone: string): Promise<Boolean> {
        const user = await prisma.user.findUnique({where:{phone}, select: {id:true}})
        return user != null
    }
    async findByRoleByType(type: string): Promise<AuthReferenceRecord | null> {
        return await prisma.role.findUnique({where:{type},select:{id:true, type:true}})
    }
    async findLanguageById(type: string): Promise<AuthReferenceRecord | null> {
        return await prisma.language.findUnique({where:{type}, select:{id:true,type:true}})
    }
    async findStatusById(type: string): Promise<AuthReferenceRecord | null> {
        return await prisma.userStatus.findUnique({where:{type}, select:{id:true,type:true}})
        
    }
    async createSignupUser(data: CreateSignupUserData): Promise<SignupResponseDto> {
        console.log("CREATE USER ROLE ID:", data.roleId);
        const user = await this.prisma.user.create({
            data: {
                firstName: data.firstName,
                lastName:data.lastName,
                email:data.email,
                phone:data.phone,
                password:data.passwordHash,

                languageId: data.languageId,
                statusId: data.statusId,

                userRoles:{
                    create:{
                        roleId:data.roleId
                    }
                },

                
            },
            select:{
                id:true,
                firstName:true,
                lastName:true,
                email:true,
                phone:true,

                userRoles: {
                    select:{
                        role: {
                            select: {
                                type:true,
                                title:true
                            }
                        }
                    }
                },
                language: {
                    select: {
                        type:true,
                        name:true
                    }

                },
                status: {
                    select:{
                        type:true,
                        title:true
                    }
                },
                createdAt:true
            }
        })


        return {
            id:user.id,
            firstName:user.firstName,
            lastName:user.lastName,
            email:user.email,
            phone:user.phone,

            role:user.userRoles[0].role,

            language:user.language,
            status:user.status,
            createdAt:user.createdAt
        }
    }
    

     async findByIdForAuth(id: string): Promise<RefreshAuthUserRecord | null> {
        const user = await this.prisma.user.findUnique({
            where:{id},
            select: {
                id:true,
                deletedAt:true,
                userRoles:{
                    select:{
                        role:{
                            select:{
                                type:true,
                                isActive:true
                            }
                        }
                    }
                },
                status:{
                    select:{
                        type:true,
                        isActive:true
                    }
                }
            }
        })
        if(!user) return null
        return {
            id:user.id,
            deletedAt:user.deletedAt,
            roles:user.userRoles.map((userRole)=>({
                type:userRole.role.type,
                isActive:userRole.role.isActive
            })),
            status:user.status
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.prisma.user.findUnique({where:{email}})
    }

     async updatePassword(userId: string, passwordHash: string): Promise<void> {
        await prisma.user.update({
            where:{id:userId},
            data:{password:passwordHash}
        })
    }

    async findUserRole(userId: string, roleId: string): Promise<boolean> {
        const userRole = await this.prisma.userRole.findUnique({
            where:{
                userId_roleId:{
                    userId,
                    roleId
                }
            },
            select:{
                userId:true
            }
        })   
        return userRole !== null 
    }

    async createUserRole(userId: string, roleId: string): Promise<void> {
        await this.prisma.userRole.create({
            data:{
                userId,
                roleId
            }
        })
    }

    async findUserWithRoleById(userId: string,roleId:string): Promise<SignupResponseDto | null> {
        const user = await this.prisma.user.findUnique({
            where:{id:userId},
            select:{
                id:true,
                firstName:true,
                lastName:true,
                phone:true,
                email:true,
                userRoles:{
                    where:{
                        roleId:roleId
                    },
                    select:{
                        role:{
                            select:{
                                type:true,
                                title:true
                            }
                        }
                    }
                },
                language:{
                    select:{
                        type:true,
                        name:true
                    }
                },
                status:{
                    select:{
                        type:true,
                        title:true
                    }
                },
                createdAt:true
            }
        })
        if(!user) return null
        const role = user.userRoles[0]?.role
        if(!role) return null;
        return {
            id:user.id,
            firstName:user.firstName,
            lastName:user.lastName,
            email:user.email,
            phone:user.phone,
            role:role,
            language:user.language,
            status:user.status,
            createdAt:user.createdAt

        }
    }

    private async findLoginUser(where:{email:string} | {id:string}):Promise<LoginUserRecord | null> {
        const user = await this.prisma.user.findUnique({
            where,
            select:{
                id:true,
                firstName:true,
                lastName:true,
                email:true,
                phone:true,
                profileImage:true,
                password:true,
                deletedAt:true,
                userRoles:{
                    select:{
                        role:{
                            select:{
                                type:true,
                                title:true,
                                isActive:true
                            }
                        }
                    }
                },
                language:{
                    select:{
                        type:true,
                        name:true
                    }
                },
                status:{
                    select:{
                        type:true,
                        title:true,
                        isActive:true
                    }
                }
            }
        })
        if(!user) return null
        return {
            id:user.id,
            firstName: user.firstName,
            lastName:user.lastName,
            email:user.email,
            phone:user.phone,
            passwordHash:user.password,
            profileImage:user.profileImage,
            deletedAt:user.deletedAt,
            roles:user.userRoles.map(userRole=>({
                type:userRole.role.type,
                title:userRole.role.title,
                isActive:userRole.role.isActive
            })),
            language:user.language,
            status:user.status
        }
    }

    async findForLoginById(userId: string): Promise<LoginUserRecord | null> {
        return this.findLoginUser({id:userId})
    }
    async findForLogin(email: string): Promise<LoginUserRecord | null> {
    return this.findLoginUser({ email });
    }

    async findUserRoleByType(userId: string, roleType: ActiveRole): Promise<userRoleRecord | null> {
        const userRole = await this.prisma.userRole.findFirst({
            where:{
                userId,
                role:{
                    type:roleType
                }
            },
            select:{
                role:{
                    select:{
                        type:true,
                        title:true,
                        isActive:true
                    }
                }
            }
        })
        if(!userRole) return null
        return userRole.role
    }
}