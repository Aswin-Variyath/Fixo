import prisma from "../../../database/prisma";
import { UserListItemResponseDto } from "../dtos/user-response.dto";
import { IUserRepository } from "../interfaces/user-repository.interface";
export class UserRepository implements IUserRepository {
  async findAll(): Promise<UserListItemResponseDto[]> {
    return prisma.user.findMany({
      where: {
        deletedAt: null
      },
      select: {
        id:true,
        firstName:true,
        lastName:true,
        email:true,
        phone:true,
        profileImage:true,
        status:{
          select: {
            type:true,
            title:true,
            colorCode:true
          }
        },
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
        lastLogin:true,
        createdAt:true,
        updatedAt:true
      },
      orderBy:{
        createdAt:"desc"
      }
    })
  }
}
