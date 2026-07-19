import {
    CreateUserData,
    UpdateUserData,
    UserListResult,
    UserRepositoryQuery,
    UserSafeData
} from "../types/user.types"

export interface IUserRepository {
    create(data: CreateUserData): Promise<UserSafeData>;
    findById(id:string): Promise<UserSafeData | null>
    findByEmail(email:string): Promise<UserSafeData | null>
    findByPhone(phone:string): Promise<UserSafeData | null>
    findMany(query: UserRepositoryQuery): Promise<UserListResult>
    update(id:string,data:UpdateUserData): Promise<UserSafeData>
    softDelete(id:string):Promise<void>
}

