import {  UserFromDatabase } from "../types/user.types";

export interface IUserRepository {
findById(userId: string): Promise<UserFromDatabase | null>;
}
