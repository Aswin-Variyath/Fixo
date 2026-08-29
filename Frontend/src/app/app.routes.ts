import { Routes } from '@angular/router';
import { guestGuard } from './core/guards/guest-guard';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
    // Customer routers
    {
        path:"",
        pathMatch: 'full',
        loadComponent:()=>
            import("./features/customer/landing/landing.component").then((m)=>m.HomeLanding)
    },
    {
        path:"signup",
        canActivate:[guestGuard],
        loadComponent:()=>
            import("./features/customer/auth/pages/signup/signup.component").then((m)=>m.SignupComponent)

    },
    {
        path:'login',
        canActivate:[guestGuard],
        loadComponent:()=>
            import("./features/customer/auth/pages/signin/login").then((m)=>m.Login)
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
    },
    // Tasker routers
    {
        path:'become-a-tasker',
        loadComponent:()=>
            import("./features/tasker/landing/pages/become-tasker/become-a-tasker-landing").then((m)=>m.BecomeTaskerLanding)
    },
    {
        path:"tasker/login",
        canActivate:[guestGuard],
        loadComponent:()=>
            import("./features/tasker/auth/pages/tasker-signin/tasker-login").then((m)=>m.TaskerLogin)
    },
    {
        path:"tasker/signup",
        canActivate:[guestGuard],
        loadComponent:()=>
            import("./features/tasker/auth/pages/tasker-signup/tasker-signup").then((m)=>m.TaskerSignup)
    },
    {
        path:"tasker/forgot-password",
        loadComponent:()=>
            import("./features/tasker/auth/pages/tasker-forgot-password/tasker-forgot-password").then((m)=>m.TaskerForgotPassword)
    },
    {
        path:"tasker/reset-password",
        loadComponent:()=>
            import("./features/tasker/auth/pages/tasker-reset-password/tasker-reset-password").then((m)=>m.TaskerResetPassword)
    },
    {
        path:"tasker/dashboard",
        loadComponent:()=>
            import("./features/tasker/dashboard/tasker-dashboard").then((m)=>m.TaskerDashboard)
    },
    {
        path:"tasker/pending-requests",
        loadComponent:()=>
            import("./features/tasker/pending-requests/pending-requests").then((m)=>m.PendingRequests)
    },
    {
        path:"tasker/pending-request-details",
        loadComponent:()=>
            import("./features/tasker/pending-request-details/pending-request-details").then((m)=>m.PendingRequestDetails)
    },
    {
        path:"tasker/upcoming-jobs",
        loadComponent:()=>
            import("./features/tasker/upcoming-jobs/upcoming-jobs").then((m)=>m.UpcomingJobs)
    },
    {
        path: "tasker/completed-jobs",
        loadComponent: () =>
            import("./features/tasker/completed-jobs/completed-jobs").then((m) => m.CompletedJobs),
    },
    {
        path: 'tasker/completed-job-details',
        loadComponent: () =>
            import('./features/tasker/completed-job-details/completed-job-details')
                .then((m) => m.CompletedJobDetails),
    },
    {
        path:"tasker/upcoming-job-details",
        loadComponent:()=>
            import("./features/tasker/upcoming-job-details/upcoming-job-details").then((m)=>m.UpcomingJobDetails)
    },
    // Admin routers
    {
        path:"admin/signin",
        loadComponent:()=>
            import("./features/admin/auth/pages/admin-signin/admin-signin").then((m)=>m.AdminSignin)
    },
    {
        path:"admin/forgot-password",
        loadComponent:()=>
            import("./features/admin/auth/pages/admin-forgot-password/admin-forgot-password").then((m)=>m.AdminForgotPassword)
    },
    {
        path:"admin/reset-password",
        loadComponent:()=>
            import("./features/admin/auth/pages/admin-reset-password/admin-reset-password").then((m)=>m.AdminResetPassword)
    },
    {
        path:'admin/dashboard',
        loadComponent:()=>
            import("./features/admin/dashboard/dashboard").then((m)=>m.Dashboard)
    },
    {
    path: 'customer/home',
    canActivate:[authGuard,roleGuard('customer')],
    loadComponent: () =>
        import('./features/customer/home/customer-home')
            .then((m) => m.CustomerHome)
    },
    {
    path: 'customer/discovery',
    loadComponent: () =>
        import('./features/customer/discovery/discovery')
            .then((m) => m.Discovery)
    },
    {
    path: 'customer/tasker-profile',
    loadComponent: () =>
        import('./features/customer/tasker-profile/tasker-profile')
            .then((m) => m.TaskerProfile)
    },
    {
    path: 'customer/booking/appointment',
    loadComponent: () =>
        import('./features/customer/booking/appointment/appointment')
            .then((m) => m.Appointment)
    },
    {
    path: 'customer/booking/booking-details',
    loadComponent: () =>
        import('./features/customer/booking/booking-details/booking-details')
            .then((m) => m.BookingDetails)
    },
    {
    path: 'customer/booking/booking-details/payment',
    loadComponent: () =>
        import('./features/customer/booking/payment/payment')
            .then((m) => m.Payment)
    },
    {
    path: 'customer/booking/confirmation',
    loadComponent: () =>
        import('./features/customer/booking/confirmation/confirmation')
            .then((m) => m.Confirmation)
    },
    {
    path: 'customer/booking/payment-failed',
    loadComponent: () =>
        import('./features/customer/booking/payment-failed/payment-failed')
            .then((m) => m.PaymentFailed)
    }
];
