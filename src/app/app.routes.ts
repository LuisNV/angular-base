import { Routes } from '@angular/router';
import { Shell } from './core/layout/shell';

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      {
        path: 'home', title: 'Trang chủ',
        loadComponent: () => import('./pages/home/home').then((m) => m.Home),
      },
      {
        path: '**', title: 'Không tìm thấy trang',
        loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
      },
    ],
  },
];
