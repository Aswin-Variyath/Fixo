import { inject, injectable } from "inversify";
import { IAuthCommandService } from "../interfaces/auth-command-service.interface";
import { IUserAuthRespository } from "../interfaces/user-auth-repository.interface";
import {TYPES } from "../../../di"
import { SignupResponseDto } from "../dto/auth-response.dto";
import { SignupDto } from "../dto/signup.dto";
import { da } from "zod/locales";
import { ConflictError } from "../../../shared/errors/conflict.error";
import { PasswordService } from "./password.service";
import { IPasswordService } from "../interfaces/password-service.interface";

@injectable()
export class AuthCommandService implements IAuthCommandService {
    constructor(@inject(TYPES.UserAuthRepository) private readonly userAuthRepository: IUserAuthRespository, @inject(TYPES.PasswordService) private readonly passwordService: IPasswordService) {}
    async signup(data: SignupDto): Promise<SignupResponseDto> {
        console.log("sdfljas")
        const emailExists = await this.userAuthRepository.existByEmail(data.email)
        if(emailExists) {
            throw new ConflictError("Email is alread registered")
        }
        const phoneExists = await this.userAuthRepository.existsByPhone(data.phone)
        if(phoneExists) {
            throw new ConflictError("Phone number is already registered")
        }

        const customerRole = await this.userAuthRepository.findByRoleByType("customer")
        const defaultLanguage = await this.userAuthRepository.findLanguageById("en")
        const activeStatus = await this.userAuthRepository.findStatusById("active")
        

        if(!customerRole || !defaultLanguage || !activeStatus) {
            throw new Error("Required signup reference data is missing")
        }

        const passwordHash = await this.passwordService.hash(data.password)

        return this.userAuthRepository.createSignupUser({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            passwordHash,
             roleId: customerRole.id,
             languageId: defaultLanguage.id,
             statusId:activeStatus.id
        })

    }
}