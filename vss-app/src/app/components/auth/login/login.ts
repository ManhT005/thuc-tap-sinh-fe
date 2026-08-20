import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../../core/services/auth';

import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,

    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCheckboxModule,
    NzAlertModule,
    NzIconModule,
    NzSelectModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
      ],
    ],
    remember: false,
  });

  readonly f = this.loginForm.controls;

  // Angular Signals
  readonly showPassword = signal(false);
  readonly loading = signal(false);
  readonly loginError = signal<string | null>(null);

  togglePassword(): void {
    this.showPassword.update(value => !value);
  }

  onSubmit(): void {
    this.loginError.set(null);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.getRawValue();

    this.loading.set(true);

    this.authService
      .login(username, password)
      .pipe(
        finalize(() => {
          // console.log('FINALIZE');
          this.loading.set(false);
        })
      )
      .subscribe({
        next: (res) => {
          this.router.navigate(['/users']);
        },

        error: (err) => {
          console.error('LOGIN ERROR:', err);

          this.loginError.set(
            'Tài khoản hoặc mật khẩu không chính xác.'
          );
        },
      });
  }
}