import { UserListItemResponseDto } from "../dtos/user-response.dto";

export interface IUserRepository {
    findAll(): Promise<UserListItemResponseDto[]>
}
