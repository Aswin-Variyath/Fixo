import { Routes } from '@angular/router';
import { publicRoutes } from './routes/public.routes';
import { customerRoutes } from './routes/customer.routes';
import { taskerRouters } from './routes/tasker.routes';
import { adminRoutes } from './routes/admin.routes';

export const routes: Routes = [
    ...publicRoutes,
    ...customerRoutes,
    ...taskerRouters,
    ...adminRoutes
];
