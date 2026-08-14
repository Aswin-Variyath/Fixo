import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { ENV } from '../../../environments/environments';
import { ApiResponse, AuthUser, LoginRequest, RefreshResponse } from './auth.types';
import { ForgotPassword } from '../../features/customer/auth/pages/forgot-password/forgot-password';
import { ResetPassword } from '../../features/customer/auth/pages/reset-password/reset-password';

@Service()
export class AuthApiService {
    private readonly http = inject(HttpClient)
    private readonly authUrl = `${ENV.API_URL}/auth`
    private readonly httpOptions = {
        withCredentials:true
    }

    login(request:LoginRequest) {
        return this.http.post<ApiResponse<AuthUser>>(`${this.authUrl}/login`,request, this.httpOptions)
    }

    logout() {
        return this.http.post<ApiResponse<null>>(`${this.authUrl}/logout`,{}, this.httpOptions)
    }

    refresh() {
        return this.http.post<ApiResponse<RefreshResponse>>(`${this.authUrl}/refresh`,{}, this.httpOptions)
    }

    me() {
        return this.http.get<ApiResponse<AuthUser>>(`${this.authUrl}/me`, this.httpOptions)
    }

    forgotPassword(request:ForgotPassword) {
        return this.http.post<ApiResponse<AuthUser>>(`${this.authUrl}/forgot-password`,request, this.httpOptions)
    }

    resetPassword(request:ResetPassword) {
        return this.http.post<ApiResponse<AuthUser>>(`${this.authUrl}/reset-password`,request, this.httpOptions)
    }

}
