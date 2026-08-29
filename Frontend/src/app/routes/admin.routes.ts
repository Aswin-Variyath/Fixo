import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: 'admin/dashboard',
    loadComponent: () => import('../features/admin/dashboard/dashboard').then((m) => m.Dashboard),
  },
];
