import { Routes } from '@angular/router';

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
    loadComponent: () => import('../features/admin/dashboard/dashboard').then((m) => m.Dashboard),
  },
];
