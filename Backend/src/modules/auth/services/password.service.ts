import { injectable } from "inversify";
import { IPasswordService } from "../interfaces/password-service.interface";
import  argon2  from "argon2";
@injectable()
export class PasswordService implements IPasswordService {
    async hash(password: string): Promise<string> {
        return argon2.hash(password,{type:argon2.argon2id})
    }
    async verify(password: string, plainPassword: string): Promise<boolean> {
        return argon2.verify(password, plainPassword)
    }
}