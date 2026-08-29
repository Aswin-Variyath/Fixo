import { Routes } from "@angular/router";
import { guestGuard } from "../core/guards/guest-guard";

export const publicRoutes: Routes = [
    // Customer public routes
    {
        path:"",
        pathMatch:'full',
        loadComponent:()=>import("../features/customer/landing/landing.component").then((m)=>m.HomeLanding)
    },
    {
        path:'signup',
        canActivate:[guestGuard],
        loadComponent:()=> import("../features/customer/auth/pages/signup/signup.component").then((m)=>m.SignupComponent)
    },
    {
        path:'login',
        canActivate:[guestGuard],
        loadComponent:()=>import("../features/customer/auth/pages/signin/login").then((m)=>m.Login)
    },
    {
        path:'forgot-password',
        loadComponent:()=>import("../features/customer/auth/pages/forgot-password/forgot-password").then((m)=>m.ForgotPassword)
    },
    {
        path:'reset-password',
        loadComponent:()=>import("../features/customer/auth/pages/reset-password/reset-password").then((m)=>m.ResetPassword)
    },
    // Tasker public routes
    {
        path:'become-a-tasker',
        loadComponent:()=>import("../features/tasker/landing/pages/become-tasker/become-a-tasker-landing").then((m)=>m.BecomeTaskerLanding)
    },
    {
        path:'tasker/login',
        canActivate:[guestGuard],
        loadComponent:()=>import("../features/tasker/auth/pages/tasker-signin/tasker-login").then((m)=>m.TaskerLogin)
    },
    {
        path:'tasker/signup',
        canActivate:[guestGuard],
        loadComponent:()=>import("../features/tasker/auth/pages/tasker-signup/tasker-signup").then((m)=>m.TaskerSignup)
    },
    {
        path:'tasker/forgot-password',
        loadComponent:()=>import("../features/tasker/auth/pages/tasker-forgot-password/tasker-forgot-password").then((m)=>m.TaskerForgotPassword)
    },
    {
        path:'tasker/reset-password',
        loadComponent:()=>import("../features/tasker/auth/pages/tasker-reset-password/tasker-reset-password").then((m)=>m.TaskerResetPassword)
    },
    // Admin public routes
    {
        path:'admin/signin',
        loadComponent:()=>import("../features/admin/auth/pages/admin-signin/admin-signin").then((m)=>m.AdminSignin)
    },
    {
        path:'admin/forgot-password',
        loadComponent:()=>import("../features/admin/auth/pages/admin-forgot-password/admin-forgot-password").then((m)=>m.AdminForgotPassword)
    },
    {
        path:'admin/reset-password',
        loadComponent:()=>import("../features/admin/auth/pages/admin-reset-password/admin-reset-password").then((m)=>m.AdminResetPassword)
    }
]