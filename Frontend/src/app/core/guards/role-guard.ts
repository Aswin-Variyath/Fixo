import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const roleGuard = (allowedRole: string): CanActivateFn => {
  return () => {

    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.user();

    if (!user) {

      if (allowedRole === 'super_admin') {
        return router.createUrlTree(['/admin/login']);
      }

      return router.createUrlTree(['/login']);
    }

    if (user.activeRole.type === allowedRole) {
      return true;
    }

    if (user.activeRole.type === 'customer') {
      return router.createUrlTree(['/customer/home']);
    }

    if (user.activeRole.type === 'tasker') {
      return router.createUrlTree(['/tasker/dashboard']);
    }

    if (user.activeRole.type === 'super_admin') {
      return router.createUrlTree(['/admin/dashboard']);
    }

    return router.createUrlTree(['/']);
  };
};