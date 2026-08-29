import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth-guard';
import { roleGuard } from '../core/guards/role-guard';

export const customerRoutes: Routes = [
  {
    path: 'customer/home',
    canActivate: [authGuard, roleGuard('customer')],
    loadComponent: () =>
      import('../features/customer/home/customer-home').then((m) => m.CustomerHome),
  },
  {
    path: 'customer/discovery',
    loadComponent: () =>
      import('../features/customer/discovery/discovery').then((m) => m.Discovery),
  },
  {
    path: 'customer/tasker-profile',
    loadComponent: () =>
      import('../features/customer/tasker-profile/tasker-profile').then((m) => m.TaskerProfile),
  },
  {
    path: 'customer/booking/appointment',
    loadComponent: () =>
      import('../features/customer/booking/appointment/appointment').then((m) => m.Appointment),
  },
  {
    path: 'customer/booking/booking-details',
    loadComponent: () =>
      import('../features/customer/booking/booking-details/booking-details').then(
        (m) => m.BookingDetails,
      ),
  },
  {
    path: 'customer/booking/booking-details/payment',
    loadComponent: () =>
      import('../features/customer/booking/payment/payment').then((m) => m.Payment),
  },
  {
    path: 'customer/booking/confirmation',
    loadComponent: () =>
      import('../features/customer/booking/confirmation/confirmation').then((m) => m.Confirmation),
  },
  {
    path: 'customer/booking/payment-failed',
    loadComponent: () =>
      import('../features/customer/booking/payment-failed/payment-failed').then(
        (m) => m.PaymentFailed,
      ),
  },
];
