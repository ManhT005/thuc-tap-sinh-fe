import { Routes } from '@angular/router';
import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';
import { ForgotPassword } from './components/auth/forgot-password/forgot-password';
import { ForgotPasswordOtp } from './components/auth/forgot-password-otp/forgot-password-otp';
import { SetPassword } from './components/auth/set-password/set-password';
import { FirstLogin } from './components/auth/first-login/first-login';
import { HomeLayout } from './components/home/layout/home-layout/home-layout';
import { UserList } from './components/home/users/user-list/user-list';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    component: HomeLayout,
    children: [
      {
        path: 'users',
        component: UserList,
      },
    ],
  },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'forgot-password-otp', component: ForgotPasswordOtp },
  { path: 'set-password', component: SetPassword },
  { path: 'first-login', component: FirstLogin },
  { path: '**', redirectTo: 'login' },
];
