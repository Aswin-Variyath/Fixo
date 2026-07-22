import { inject, injectable } from "inversify";
import { IUserQueryService } from "../interfaces/user-query-service.interface";
import { IUserRepository } from "../interfaces/user-repository.interface";
import { TYPES } from "../../../di";
import { UserListItemResponseDto } from "../dtos/user-response.dto";


@injectable()
export class UserQueryService implements IUserQueryService {
 constructor(@inject(TYPES.UserRepository) private readonly userRepository: IUserRepository) {}
 async listUsers(): Promise<UserListItemResponseDto[]> {
   return this.userRepository.findAll()
 }
}
