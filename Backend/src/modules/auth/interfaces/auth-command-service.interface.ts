import { AdminLoginDto } from "../dto/admin-login.dto";
import { ForgotPasswordResult, loginResponseDto, SignupResponseDto, SignupResult } from "../dto/auth-response.dto";
import { LoginDto } from "../dto/login.dto";
import { ResetPasswordDto } from "../dto/reset-password.dto";
import { SignupDto } from "../dto/signup.dto";
import { SwitchRoleResult } from "../dto/switch-role.dto";
import { TaskerSignupDto } from "../dto/tasker-signup.dt0";
import { VerifyAdminOtpDto } from "../dto/verfiy-admin-otp.dto";
import { ActiveRole } from "../types/auth-session.types";

export interface LoginResult {
    response:loginResponseDto,
    accessToken: string
    refreshToken:string
}

export interface RefreshResult {
    accessToken:string
    refreshToken:string
    accessTokenExpiresIn:number
}

export interface AdminLoginResult {
    challengeId: string
    otpExpiresIn:number
    resendAfter: number
}

export interface AdminVerifyOtpResult {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresIn: number;
}


export interface IAuthCommandService {
    signup(data:SignupDto):Promise<SignupResult>
    login(data:LoginDto):Promise<LoginResult>
    refresh(refreshToken:string):Promise<RefreshResult>
    logout(refreshToken:string):Promise<void>
    forgotPassword(email:string):Promise<ForgotPasswordResult | null>
    resetPassword(data:ResetPasswordDto):Promise<void>
    getPasswordResetExpiry(token:string):Promise<{expiresAt:Date}>
    taskerSignup(data:TaskerSignupDto):Promise<SignupResult>
    becomeTasker(userId:string):Promise<void>
    becomeCustomer(userId:string):Promise<void>
    switchRole(userId:string,sessionId:string,role:ActiveRole):Promise<SwitchRoleResult>
    adminLogin(data:AdminLoginDto):Promise<AdminLoginResult>
    verifyAdminOtp(userId:string,otp:string):Promise<AdminVerifyOtpResult>
}
