import prisma from "../../../database/prisma";
import { SignupResponseDto } from "../dto/auth-response.dto";
import { AuthReferenceRecord, CreateSignupUserData, IUserAuthRespository } from "../interfaces/user-auth-repository.interface";

export class UserAuthRepository implements IUserAuthRespository {
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
        return prisma.user.create({
            data:{
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone:data.phone,
                password:data.passwordHash,
                roleId:data.roleId,
                languageId: data.languageId,
                statusId: data.statusId
            },
            select:{
                id:true, 
                firstName:true, 
                lastName:true, 
                email:true, 
                phone:true, 
                role:{
                    select:{
                        type:true,
                        title:true
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
    }
     
}