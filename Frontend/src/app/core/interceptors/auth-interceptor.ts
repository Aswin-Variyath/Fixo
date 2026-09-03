import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthApiService } from '../auth/auth-api.service';
import { AuthStore } from '../auth/auth.store';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

let isRefreshing:boolean = false
const refreshTokenSubject = new BehaviorSubject<boolean>(false)

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log("Auth",req.method, req.url)

  const authService = inject(AuthService)
  const authStore = inject(AuthStore)

  const credentialRequest = req.clone({withCredentials:true})

  const isAuthRequest = req.url.includes('/auth/login') || req.url.includes('/auth/refresh') || req.url.includes('/auth/logout');

  if (isAuthRequest) {
        return next(credentialRequest);
    }

    return next(credentialRequest).pipe(
        catchError((error: HttpErrorResponse) => {

            if (error.status !== 401) {
                return throwError(() => error);
            }

            if (isRefreshing) {
                return refreshTokenSubject.pipe(
                    filter((refreshed) => refreshed),
                    take(1),
                    switchMap(() => next(credentialRequest))
                );
            }

            isRefreshing = true;
            refreshTokenSubject.next(false);

            return authService.refresh().pipe(
                switchMap(() => {
                    isRefreshing = false;
                    refreshTokenSubject.next(true);

                    return next(credentialRequest);
                }),
                catchError((refreshError) => {
                    isRefreshing = false;
                    refreshTokenSubject.next(false);

                    authStore.setUnauthenticated();

                    return throwError(() => refreshError);
                })
            );
        })
    );
  
};
