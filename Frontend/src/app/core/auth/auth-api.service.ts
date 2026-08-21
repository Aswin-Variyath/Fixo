import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { ENV } from '../../../environments/environments';
import { ApiResponse,  AuthUser, LoginRequest, LoginResponse, RefreshResponse, SignupRequest } from './auth.types';

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

   

}
