import { inject, Service } from '@angular/core';
import { AuthApiService } from './auth-api.service';
import { AuthStore } from './auth.store';
import { LoginRequest } from './auth.types';
import { ForgotPassword } from '../../features/customer/auth/pages/forgot-password/forgot-password';
import { ResetPassword } from '../../features/customer/auth/pages/reset-password/reset-password';
import { catchError, of, tap } from 'rxjs';

@Service()
export class AuthService {
    private readonly authApiService = inject(AuthApiService)
    private readonly authStore = inject(AuthStore)

    readonly status = this.authStore.status
    readonly user = this.authStore.user
    readonly isAuthenticated = this.authStore.isAuthenticated;
    readonly isLoading = this.authStore.isLoading

    initialize():void {
        this.authApiService.me().pipe(
            tap((response)=>{
                if(response.data) this.authStore.setAuthenticated(response.data)
                else this.authStore.setUnauthenticated()
            }),
            catchError(()=> {
                this.authStore.setUnauthenticated()
                return of(null)
            })
        )
    }

    login(request: LoginRequest) {
        return this.authApiService.login(request).pipe(
            tap((response) => {
                if(response.data) this.authStore.setAuthenticated(response.data)
            })
        )
    }

    logout() {
        return this.authApiService.logout().subscribe({
            next:() => {
                this.authStore.setUnauthenticated()
            } 
        })
    }

    refresh() {
        return this.authApiService.refresh()
    }

    me() {
        return this.authApiService.me()
    }

    forgotPassword(request:ForgotPassword) {
        return this.authApiService.forgotPassword(request)
    }

    resetPassword(request: ResetPassword) {
        return this.authApiService.resetPassword(request)
    }


}
