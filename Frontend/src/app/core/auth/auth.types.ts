export type AuthStatus = 'unknown' | 'authenticated' | 'unauthenticated';

export interface ApiResponse<T> {
    success:boolean
    message:string
    data:T
}

export interface AuthUser {
    id:string;
    firstName:string
    lastName:string
    email:string
    phone:string
    profileImage:string | null
    role: {
        type:string
        title:string
    },
    language:{
        type:string
        name:string
    }
    status:{
        type:string
        title:string
    }
}

export interface LoginRequest {
    email:string
    password:string
}

export interface LoginResponse {
    accessTokenExpiresIn: number;
    user: AuthUser;
}