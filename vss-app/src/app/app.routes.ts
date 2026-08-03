import { Routes } from '@angular/router';
import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';
import { ForgotPassword } from './components/auth/forgot-password/forgot-password';
import { ForgotPasswordOtp } from './components/auth/forgot-password-otp/forgot-password-otp';
import { SetPassword } from './components/auth/set-password/set-password';
import { FirstLogin } from './components/auth/first-login/first-login';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'forgot-password-otp', component: ForgotPasswordOtp },
  { path: 'set-password', component: SetPassword },
  { path: 'first-login', component: FirstLogin },
  { path: '**', redirectTo: 'login' },
];
