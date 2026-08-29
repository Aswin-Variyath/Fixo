import { Routes } from '@angular/router';

export const taskerRouters: Routes = [
  {
    path: 'tasker/dashboard',
    loadComponent: () =>
      import('../features/tasker/dashboard/tasker-dashboard').then((m) => m.TaskerDashboard),
  },
  {
    path: 'tasker/pending-requests',
    loadComponent: () =>
      import('../features/tasker/pending-requests/pending-requests').then((m) => m.PendingRequests),
  },
  {
    path: 'tasker/pending-request-details',
    loadComponent: () =>
      import('../features/tasker/pending-request-details/pending-request-details').then(
        (m) => m.PendingRequestDetails,
      ),
  },
  {
    path: 'tasker/upcoming-jobs',
    loadComponent: () =>
      import('../features/tasker/upcoming-jobs/upcoming-jobs').then((m) => m.UpcomingJobs),
  },
  {
    path: 'tasker/completed-jobs',
    loadComponent: () =>
      import('../features/tasker/completed-jobs/completed-jobs').then((m) => m.CompletedJobs),
  },
  {
    path: 'tasker/completed-job-details',
    loadComponent: () =>
      import('../features/tasker/completed-job-details/completed-job-details').then(
        (m) => m.CompletedJobDetails,
      ),
  },
  {
    path: 'tasker/todays-earnings',
    loadComponent: () =>
      import('../features/tasker/todays-earnings/todays-earnings').then((m) => m.TodaysEarnings),
  },
  {
    path: 'tasker/find-jobs',
    loadComponent: () => import('../features/tasker/find-jobs/find-jobs').then((m) => m.FindJobs),
  },
  {
    path: 'tasker/availability',
    loadComponent: () =>
      import('../features/tasker/availability/availability').then((m) => m.Availability),
  },
  {
    path: 'tasker/upcoming-job-details',
    loadComponent: () =>
      import('../features/tasker/upcoming-job-details/upcoming-job-details').then(
        (m) => m.UpcomingJobDetails,
      ),
  },
];
