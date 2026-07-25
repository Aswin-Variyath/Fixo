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
    role: {
        type:string
        isActive:boolean
    },
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
    findForLogin(email:string):Promise<LoginUserRecord | null>
    findByIdForAuth(id:string):Promise<RefreshAuthUserRecord | null>

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
    role: {
        type:string
        title:string
        isActive:boolean
    }
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
