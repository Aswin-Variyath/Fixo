import { CurrentUser } from "../types/user.types";

export interface IUserQueryService {
    getCurrentUser(userId:string):Promise<CurrentUser>
}