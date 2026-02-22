import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/pages/search-page/search-page').then(m => m.SearchPage)
    },
    { path: '**', redirectTo: '' },
];
