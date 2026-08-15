import prisma from "../../../database/prisma/prisma";
import { IUserRepository } from "../interfaces/user-repository.interface";
import { CurrentUser } from "../types/user.types";
export class UserRepository implements IUserRepository {
  async findById(userId: string): Promise<CurrentUser | null> {
    return prisma.user.findUnique({
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
        role:{
          select:{
            type:true,
            title:true
          }
        },
        language: {
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
  }
    
}
