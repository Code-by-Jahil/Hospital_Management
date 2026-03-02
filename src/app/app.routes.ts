import { Routes } from '@angular/router';

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
];
