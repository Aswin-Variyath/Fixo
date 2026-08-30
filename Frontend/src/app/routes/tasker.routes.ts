import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth-guard';
import { roleGuard } from '../core/guards/role-guard';

export const taskerRouters: Routes = [
  {
    path: 'tasker/dashboard',
    canActivate: [authGuard, roleGuard('tasker')],
    loadComponent: () =>
      import('../features/tasker/dashboard/tasker-dashboard').then((m) => m.TaskerDashboard),
  },
  {
    path: 'tasker/pending-requests',
    canActivate: [authGuard, roleGuard('tasker')],
    loadComponent: () =>
      import('../features/tasker/pending-requests/pending-requests').then((m) => m.PendingRequests),
  },
  {
    path: 'tasker/pending-request-details',
    canActivate: [authGuard, roleGuard('tasker')],
    loadComponent: () =>
      import('../features/tasker/pending-request-details/pending-request-details').then(
        (m) => m.PendingRequestDetails,
      ),
  },
  {
    path: 'tasker/upcoming-jobs',
    canActivate: [authGuard, roleGuard('tasker')],
    loadComponent: () =>
      import('../features/tasker/upcoming-jobs/upcoming-jobs').then((m) => m.UpcomingJobs),
  },
  {
    path: 'tasker/completed-jobs',
    canActivate: [authGuard, roleGuard('tasker')],
    loadComponent: () =>
      import('../features/tasker/completed-jobs/completed-jobs').then((m) => m.CompletedJobs),
  },
  {
    path: 'tasker/completed-job-details',
    canActivate: [authGuard, roleGuard('tasker')],
    loadComponent: () =>
      import('../features/tasker/completed-job-details/completed-job-details').then(
        (m) => m.CompletedJobDetails,
      ),
  },
  {
    path: 'tasker/todays-earnings',
    canActivate: [authGuard, roleGuard('tasker')],
    loadComponent: () =>
      import('../features/tasker/todays-earnings/todays-earnings').then((m) => m.TodaysEarnings),
  },
  {
    path: 'tasker/find-jobs',
    canActivate: [authGuard, roleGuard('tasker')],
    loadComponent: () => import('../features/tasker/find-jobs/find-jobs').then((m) => m.FindJobs),
  },
  {
    path: 'tasker/availability',
    canActivate: [authGuard, roleGuard('tasker')],
    loadComponent: () =>
      import('../features/tasker/availability/availability').then((m) => m.Availability),
  },
  {
    path: 'tasker/upcoming-job-details',
    canActivate: [authGuard, roleGuard('tasker')],
    loadComponent: () =>
      import('../features/tasker/upcoming-job-details/upcoming-job-details').then(
        (m) => m.UpcomingJobDetails,
      ),
  },
];
