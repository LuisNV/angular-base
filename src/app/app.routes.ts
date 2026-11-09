import { Routes } from '@angular/router';
import { provideAuth } from './features/auth/auth.providers';
import { provideProfile } from './features/profile/profile.providers';
import { Shell } from './core/layout/shell';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    providers: provideAuth(),
    title: 'Đăng nhập',
    loadComponent: () =>
      import('./features/auth/presentation/pages/login/login').then((m) => m.Login),
  },
  {
    path: '',
    component: Shell,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      {
        path: 'home',
        title: 'Trang chủ',
        loadComponent: () =>
          import('./features/home/presentation/pages/home/home').then((m) => m.Home),
      },
      {
        path: 'profile',
        title: 'Hồ sơ',
        providers: [...provideProfile(), ...provideAuth()],
        loadComponent: () =>
          import('./features/profile/presentation/pages/profile/profile').then((m) => m.Profile),
      },
      {
        path: '**',
        title: 'Không tìm thấy trang',
        loadComponent: () => import('./shared/pages/not-found/not-found').then((m) => m.NotFound),
      },
    ],
  },
];
