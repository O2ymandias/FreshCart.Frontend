import { Routes } from '@angular/router';
import { MainComponent } from './layout/main/main.component';
import { mainRoutes } from './app.main-routes';
import { authRoutes } from './app.auth-routes';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: mainRoutes,
  },

  {
    path: 'auth',
    loadComponent: () =>
      import('./layout/auth/auth.component').then((m) => m.AuthComponent),
    children: authRoutes,
  },

  {
    path: '**',
    loadComponent: () =>
      import('./pages/notfound/notfound.component').then(
        (m) => m.NotfoundComponent,
      ),
  },
];
