import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: 'register',
    component: RegisterComponent,
    title: 'Register',
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
  },

  {
    path: 'forget-password',
    loadComponent: () =>
      import('./pages/auth/forget-password/forget-password.component').then(
        (m) => m.ForgetPasswordComponent,
      ),

    title: 'Forget Password',
  },

  {
    path: 'reset-password',
    loadComponent: () =>
      import('./pages/auth/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent,
      ),

    title: 'Reset Password',
  },
];
