import { SignupResponseDto } from "../dto/auth-response.dto"

export interface CreateSignupUserData {
    firstName: string
    lastName: string
    email: string
    phone:string
    passwordHash: string
    roleId: string
    languageId:string
    statusId: string

}

export interface AuthReferenceRecord {
    id: string
    type: string
}

export interface IUserAuthRespository {
    existByEmail(email:string):Promise<Boolean>
    existsByPhone(phone:string):Promise<Boolean>
    findByRoleByType(type:string):Promise<AuthReferenceRecord | null>
    findLanguageById(type:string):Promise<AuthReferenceRecord | null>
    findStatusById(type:string):Promise<AuthReferenceRecord | null>
    createSignupUser(data:CreateSignupUserData):Promise<SignupResponseDto>
}