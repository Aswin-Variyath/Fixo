import { Routes } from '@angular/router';
import { roleGuard } from '../core/guards/role-guard';

export const adminRoutes: Routes = [
  {
    path:'admin/login',
    loadComponent:()=>import("../features/admin/auth/admin-signin/admin-signin").then((m)=>m.AdminSignin)
  },
  {
    path:'admin/verify-otp',
    loadComponent:()=>import("../features/admin/auth/admin-verify-otp/admin-verify-otp").then((m)=>m.AdminVerifyOtp)
  },
  {
    path: 'admin/dashboard',
    canActivate: [roleGuard('super_admin')],
    loadComponent: () => import('../features/admin/dashboard/dashboard').then((m) => m.Dashboard),
  },
];
