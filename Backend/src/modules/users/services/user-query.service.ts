import { inject, injectable } from "inversify";
import { IUserQueryService } from "../interfaces/user-query-service.interface";
import { IUserRepository } from "../interfaces/user-repository.interface";
import { TYPES } from "../../../di";
import { CurrentUser } from "../types/user.types";
import { AppError } from "../../../shared/errors/app.error";
import { StatusCodes } from "http-status-codes";


@injectable()
export class UserQueryService implements IUserQueryService {
 constructor(@inject(TYPES.UserRepository) private readonly userRepository: IUserRepository) {}
  async getCurrentUser(userId: string): Promise<CurrentUser> {
    const user = await this.userRepository.findById(userId)

    if(!user) {
      throw new AppError(StatusCodes.NOT_FOUND,"User not found")
    }

    return user

  }
 
}
