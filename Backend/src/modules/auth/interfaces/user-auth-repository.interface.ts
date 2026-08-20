import { User } from "../../../database/generated/prisma/client"
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


export interface RefreshAuthUserRecord {
    id:string;
    deletedAt: Date | null
    
    roles: {
        type:string
        isActive:boolean
    }[]

    status: {
        type:string
        isActive:boolean
    }
}

export interface IUserAuthRespository {
    existByEmail(email:string):Promise<Boolean>
    existsByPhone(phone:string):Promise<Boolean>
    findByRoleByType(type:string):Promise<AuthReferenceRecord | null>
    findLanguageById(type:string):Promise<AuthReferenceRecord | null>
    findStatusById(type:string):Promise<AuthReferenceRecord | null>
    createSignupUser(data:CreateSignupUserData):Promise<SignupResponseDto>
    findByIdForAuth(id:string):Promise<RefreshAuthUserRecord | null>
    findByEmail(email:string):Promise<User | null>
    updatePassword(userId:string, passwordHash:string):Promise<void>
    findUserRole(userId:string,roleId:string):Promise<boolean>
    createUserRole(userId:string,roleId:string):Promise<void>
    findUserWithRoleById(userId:string,roleId:string):Promise<SignupResponseDto | null>
    findForLoginById(userId:string):Promise<LoginUserRecord | null>
    findForLogin(email: string): Promise<LoginUserRecord | null>;
}

export interface LoginUserRecord {
    id:string
    firstName:string
    lastName:string
    email:string
    phone:string
    passwordHash:string
    profileImage:string | null
    deletedAt: Date | null

    roles: {
        type:string
        title:string
        isActive:boolean
    }[]

    language: {
        type:string
        name:string
    }
    status: {
        type:string
        title:string
        isActive:boolean
    }
}
