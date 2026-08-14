export type UserRole = 'customer' | 'tasket' | 'admin'

export type AuthStatus = 'unknown' | 'authenticated' | 'unathenticated';

export interface ApiResponse<T> {
    success: boolean
    message: string;
    data?: T
}

export interface AuthUser {
    userId: string
    role: UserRole
    sessionId:string
}

export interface LoginRequest {
    email: string
    password:string
}

export interface ForgotPasswordRequest {
    email:string
}

export interface ResetPasswordRequest {
    token:string
    password:string
}

export interface RefreshResponse {
    accessTokenExpiresIn:number
}
