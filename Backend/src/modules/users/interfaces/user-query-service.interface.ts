import { CurrentUser } from "../types/user.types";

export interface IUserQueryService {
    getCurrentUser(userId:string,sessionId:string):Promise<CurrentUser>
}