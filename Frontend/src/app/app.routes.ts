import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:"",
        loadComponent:()=>
            import("./features/landing/customer/home.component").then((m)=>m.HomeLanding)
    },
    {
        path:"signup",
        loadComponent:()=>
            import("./features/auth/pages/signup/signup.component").then((m)=>m.SignupComponent)

    },
    {
        path:'login',
        loadComponent:()=>
            import("./features/auth/pages/login/login").then((m)=>m.Login)
    }
];
