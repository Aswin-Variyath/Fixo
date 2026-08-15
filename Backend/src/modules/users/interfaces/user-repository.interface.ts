import { CurrentUser } from "../types/user.types";

export interface IUserRepository {
findById(userId: string): Promise<CurrentUser | null>;
}
