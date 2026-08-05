import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:"",
        loadComponent:()=>
            import("./features/customer/landing/pages/customer/home.component").then((m)=>m.HomeLanding)
    },
    {
        path:"signup",
        loadComponent:()=>
            import("./features/customer/auth/pages/signup/signup.component").then((m)=>m.SignupComponent)

    },
    {
        path:'login',
        loadComponent:()=>
            import("./features/customer/auth/pages/login/login").then((m)=>m.Login)
    },
    {
        path:'forgot-password',
        loadComponent:()=>
            import('./features/customer/auth/pages/forgot-password/forgot-password').then((m)=>m.ForgotPassword)
    },
    {
        path:'reset-password',
        loadComponent:()=>
            import("./features/customer/auth/pages/reset-password/reset-password").then((m)=>m.ResetPassword)
    },{
        path:'become-a-tasker',
        loadComponent:()=>
            import("./features/tasker/landing/pages/become-tasker/become-a-tasker-landing").then((m)=>m.BecomeTaskerLanding)
    }
];
