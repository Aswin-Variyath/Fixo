import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)
  console.log(
        'GuestGuard:',
        authService.isAuthenticated(),
        authService.user()
    );
  if(authService.isAuthenticated()) {
    console.log('BLOCK LOGIN');
    return router.createUrlTree(['/'])
  }
  return true;
};
