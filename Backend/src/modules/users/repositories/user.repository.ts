import prisma from "../../../database/prisma/prisma";
import { IUserRepository } from "../interfaces/user-repository.interface";
import { CurrentUser, UserFromDatabase } from "../types/user.types";
export class UserRepository implements IUserRepository {
  async findById(userId: string): Promise<UserFromDatabase | null> {
    const user = await prisma.user.findUnique({
      where:{
        id:userId
      },
      select:{
        id:true,
        firstName:true,
        lastName:true,
        email:true,
        phone:true,
        profileImage:true,
        userRoles:{
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
        }
      }
    }) 
    if(!user) return null

return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    profileImage: user.profileImage,

    roles: user.userRoles.map((userRole) => ({
        type: userRole.role.type,
        title: userRole.role.title
    })),

    language: user.language,
    status: user.status
}
  }
}
