import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { ENV } from '../../../environments/environments';
import { ApiResponse,  AuthUser, LoginRequest, LoginResponse } from './auth.types';

@Service()
export class AuthApiService {
    private readonly http = inject(HttpClient)
    private readonly authUrl = `${ENV.API_URL}/auth`
    private readonly userUrl = `${ENV.API_URL}/users`
    private readonly httpOptions = {
        withCredentials:true
    }

    login(request:LoginRequest) {
        return this.http.post<ApiResponse<LoginResponse>>(`${this.authUrl}/login`,request, this.httpOptions)
    }


    me() {
        return this.http.get<ApiResponse<AuthUser>>(`${this.userUrl}/me`, this.httpOptions)
    }

   logout() {
    return this.http.post<ApiResponse<null>>(`${this.authUrl}/logout`,{},this.httpOptions)
   }

}
