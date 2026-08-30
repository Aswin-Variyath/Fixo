import { inject, Service } from '@angular/core';
import { AuthApiService } from './auth-api.service';
import { AuthStore } from './auth.store';
import { ForgotPasswordRequest, LoginRequest, ResetPasswordRequest, SignupRequest } from './auth.types';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Service()
export class AuthService {
    private readonly authApiService = inject(AuthApiService)
    private readonly authStore = inject(AuthStore)

    readonly status = this.authStore.status
    readonly user = this.authStore.user
    readonly isAuthenticated = this.authStore.isAuthenticated;
    readonly isLoading = this.authStore.isLoading

    initialize():Observable<void> {
        return this.authApiService.me().pipe(
            tap((response)=>{
                this.authStore.setAuthenticated(response.data)
            }),
            map(()=>void 0),
            catchError(()=>{
                this.authStore.setUnauthenticated()
                return of(void 0)
            })
        )
    }

    login(request: LoginRequest) {
        return this.authApiService.login(request).pipe(
            tap((response) => {
                this.authStore.setAuthenticated(response.data.user)
            })
        )
    }

    logout() {
        return this.authApiService.logout().pipe(
            tap(()=>{
                this.authStore.setUnauthenticated();
            })
        )
    }

    refresh() {
        return this.authApiService.refresh()
    }
    signup(request:SignupRequest) {
        return this.authApiService.signup(request).pipe(
            tap((response)=>{
                this.authStore.setAuthenticated(response.data)
            })
        )
    }

    signupTasker(request: SignupRequest) {
        return this.authApiService.signupTasker(request).pipe(
            tap((response) => {
            this.authStore.setAuthenticated(response.data);
                })
            );
            }

    forgotPassword(request:ForgotPasswordRequest) {
        return this.authApiService.forgotPassword(request)
    }

    validateResetToken(token:string) {
        return this.authApiService.validateResetToken(token)
    }

    resetPassword(request: ResetPasswordRequest) {
        return this.authApiService.resetPassword(request);
    }

}   
