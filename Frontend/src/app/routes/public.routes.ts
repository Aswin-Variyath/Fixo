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
        loadComponent:()=>import("../shared/components/auth/forgot-password/forgot-password").then((m)=>m.ForgotPassword)
    },
    {
        path:'reset-password',
        loadComponent:()=>import("../shared/components/auth/reset-password/reset-password").then((m)=>m.ResetPassword)
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
   
]