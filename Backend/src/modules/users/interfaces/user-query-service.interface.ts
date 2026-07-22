import { UserListItemResponseDto } from "../dtos/user-response.dto";

export interface IUserQueryService {
    listUsers():Promise<UserListItemResponseDto[]>
}