export type AuthStatus =
    | 'unknown'
    | 'authenticated'
    | 'unauthenticated';

export type ActiveRole = 'customer' | 'tasker';

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface Role {
    type: ActiveRole;
    title: string;
}

export interface AuthUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    profileImage: string | null;

    roles: {
        type: string;
        title: string;
    }[];

    activeRole: {
        type: string;
        title: string;
    };

    language: {
        type: string;
        name: string;
    };

    status: {
        type: string;
        title: string;
    };
}

export interface LoginRequest {
    email: string;
    password: string;
    role: ActiveRole;
}

export interface LoginResponse {
    accessTokenExpiresIn: number;
    user: AuthUser;
}

export interface RefreshResponse {
    accessTokenExpiresIn: number;
}
export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ForgotPasswordResponse {
    expiresAt: string;
}

export interface ResetPasswordTokenResponse {
    expiresAt: string;
}

export interface ResetPasswordRequest {
    token: string;
    password: string;
}


// Admin side auth types

export interface AdminLoginRequest {
    email:string
    password:string
}

export interface AdminLoginResponse {
    challengeId:string
    otpExpiresIn:number
    resendAfter:number
}

export interface VerifyAdminOtpRequest {
    challengeId:string
    otp:string
}

export interface VerifyAdminOtpResponse {
    accessTokenExpiresIn:number
}

export interface AdminOtpSession {
  challengeId: string;
  otpExpiresAt: number;
  resendAvailableAt: number;
}

export interface ResendAdminOtpRequest {
    challengeId:string
}
