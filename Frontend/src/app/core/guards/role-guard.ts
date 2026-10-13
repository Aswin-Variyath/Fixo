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

    const activeRole = user.activeRole?.type;

    if (!activeRole) {
      return router.createUrlTree(['/']);
    }

    if (activeRole === allowedRole) {
      return true;
    }

    if (activeRole === 'customer') {
      return router.createUrlTree(['/customer/home']);
    }

    if (activeRole === 'tasker') {
      return router.createUrlTree(['/tasker/dashboard']);
    }

    if (activeRole === 'super_admin') {
      return router.createUrlTree(['/admin/dashboard']);
    }

    return router.createUrlTree(['/']);
  };
};
