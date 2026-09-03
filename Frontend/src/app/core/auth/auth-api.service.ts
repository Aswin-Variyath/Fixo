import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { ENV } from '../../../environments/environments';
import { AdminLoginRequest, AdminLoginResponse, ApiResponse,  AuthUser, ForgotPasswordRequest, ForgotPasswordResponse, LoginRequest, LoginResponse, RefreshResponse, ResendAdminOtpRequest, ResetPasswordRequest,  ResetPasswordTokenResponse,  SignupRequest, VerifyAdminOtpRequest, VerifyAdminOtpResponse } from './auth.types';

@Service()
export class AuthApiService {
    private readonly http = inject(HttpClient)
    private readonly authUrl = `${ENV.API_URL}/auth`
    private readonly userUrl = `${ENV.API_URL}/users`
    

    login(request:LoginRequest) {
        return this.http.post<ApiResponse<LoginResponse>>(`${this.authUrl}/login`,request, )
    }


    me() {
        return this.http.get<ApiResponse<AuthUser>>(`${this.userUrl}/me`, )
    }

   logout() {
    return this.http.post<ApiResponse<null>>(`${this.authUrl}/logout`,{},)
   }

   refresh() {
    return this.http.post<ApiResponse<RefreshResponse>>(`${this.authUrl}/refresh`,{},)
   }

   signup(request:SignupRequest) {
    return this.http.post<ApiResponse<AuthUser>>(`${this.authUrl}/signup`,request)
   }

   signupTasker(requset:SignupRequest) {
    return this.http.post<ApiResponse<AuthUser>>(`${this.authUrl}/tasker-signup`,requset)
   }

   forgotPassword(request:ForgotPasswordRequest) {
    return this.http.post<ApiResponse<ForgotPasswordResponse>>(`${this.authUrl}/forgot-password`,request)
   }

   validateResetToken(token:string) {
    return this.http.get<ApiResponse<ResetPasswordTokenResponse>>(`${this.authUrl}/reset-password`,{params:{token}})
   }

   resetPassword(request:ResetPasswordRequest) {
    return this.http.post<ApiResponse<null>>(`${this.authUrl}/reset-password`,request)
   }

   adminLogin(request:AdminLoginRequest) {
    return this.http.post<ApiResponse<AdminLoginResponse>>(`${this.authUrl}/admin-login`,request)
   }

   verifyAdminOtp(request:VerifyAdminOtpRequest) {
    return this.http.post<ApiResponse<VerifyAdminOtpResponse>>(`${this.authUrl}/verify-otp`,request)
   }

   resendAdminOtp(request:ResendAdminOtpRequest) {
    return this.http.post<ApiResponse<AdminLoginResponse>>(`${this.authUrl}/admin-resend-otp`,request)
   }
}
