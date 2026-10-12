import { inject, Service } from '@angular/core';
import { AuthApiService } from './auth-api.service';
import { AuthStore } from './auth.store';
import { ActiveRole, AdminLoginRequest, ForgotPasswordRequest, LoginRequest, ResendAdminOtpRequest, ResetPasswordRequest, SignupRequest, VerifyAdminOtpRequest } from './auth.types';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AdminOtpStateService } from './admin-otp-state.service';

@Service()
export class AuthService {
    private readonly authApiService = inject(AuthApiService)
    private readonly authStore = inject(AuthStore)
    private readonly adminOtpState = inject(AdminOtpStateService)

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
signup(request: SignupRequest) {
  return this.authApiService.signup(request).pipe(
    tap((response) => {
      const user = response.data;

      this.authStore.setAuthenticated({
        ...user,
        profileImage: null,
        roles: [user.role],
        activeRole: user.role,
      });
    })
  );
}

   signupTasker(request: SignupRequest) {
  return this.authApiService.signupTasker(request).pipe(
    tap((response) => {
      const user = response.data;

      this.authStore.setAuthenticated({
        ...user,
        profileImage: null,
        roles: [user.role],
        activeRole: user.role,
      });
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

    adminLogin(request:AdminLoginRequest) {
        return this.authApiService.adminLogin(request).pipe(
            tap((res)=>{
                 console.log(
                'Saving OTP session:',
                res.data
            );
                this.adminOtpState.setSession(
                    res.data.challengeId,
                    res.data.otpExpiresIn,
                    res.data.resendAfter
                )
            })
        )
    }

    verifyAdminOtp(request:VerifyAdminOtpRequest) {
        return this.authApiService.verifyAdminOtp(request)
    }

    resendAdminOtp(request:ResendAdminOtpRequest){
        return this.authApiService.resendAdminOtp(request).pipe(
            tap((response)=>{
                this.adminOtpState.updateSession(
                    response.data.challengeId,
                    response.data.otpExpiresIn,
                    response.data.resendAfter
                )
            })
        )
    }

    becomeTasker() {
        return this.authApiService.becomeTasker();
    }

    becomeCustomer() {
        return this.authApiService.becomeCustomer();
    }

    switchRole(role: ActiveRole) {
    return this.authApiService.switchRole(role).pipe(
        tap((response) => {
            const currentUser = this.authStore.user();

            if (!currentUser) {
                return;
            }

            this.authStore.setUser({
                ...currentUser,
                activeRole: response.data.activeRole,
            });
        })
    );
}

}   
