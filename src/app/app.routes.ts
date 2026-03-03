import { Routes } from '@angular/router';
import { Layout } from './Components/layout/layout';
import { authGuard } from './Guard/auth-guard';

export const routes: Routes = [


    {
        path: '',
        loadComponent: () =>
            import('./Components/login/login')
                .then(c => c.Login)
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./Components/login/login')
                .then(c => c.Login)
    },
    {
        path: 'register',
        loadComponent: () =>
            import('./Components/register/register')
                .then(c => c.Register)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./Pages/dashboard/dashboard').then(m => m.Dashboard),
        canActivate: [authGuard],
        children: [
            {
                path: 'patients',
                loadComponent: () => import('./Pages/patients/patients').then(m => m.Patients), canActivate: [authGuard]
            },
            {
                path: 'doctors',
                loadComponent: () => import('./Pages/doctors/doctors').then(m => m.Doctors), canActivate: [authGuard]
            },
            {
                path: 'appointments',
                loadComponent: () => import('./Pages/appointments/appointments').then(m => m.Appointments), canActivate: [authGuard]
            },
            {
                path: 'billing',
                loadComponent: () => import('./Pages/billing/billing').then(m => m.Billing),
                canActivate: [authGuard]
            },
            {
                path: 'reports',
                loadComponent: () => import('./Pages/reports/reports').then(m => m.Reports),
                canActivate: [authGuard]
            },
            {
                path: 'profile',
                loadComponent: () => import('./Pages/profile/profile').then(m => m.Profile),
                canActivate: [authGuard]
            }
        ],
    },
];
