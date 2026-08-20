import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { Router, RouterModule } from '@angular/router';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  standalone: true,
  selector: 'app-set-password',

  imports: [
    ReactiveFormsModule,
    RouterModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
  ],

  templateUrl: './set-password.html',
  styleUrl: './set-password.scss',
})
export class SetPassword {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // ================= PASSWORD VISIBILITY =================

  showPassword = signal(false);
  showConfirmPassword = signal(false);

  // ================= FORM =================

  passwordForm = this.fb.nonNullable.group(
    {
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
        ],
      ],

      confirmPassword: ['', Validators.required],
    },
    {
      validators: this.passwordMatchValidator,
    },
  );

  // ================= FORM CONTROLS =================

  get f() {
    return this.passwordForm.controls;
  }

  /**
   * Kiểm tra mật khẩu và mật khẩu nhập lại có giống nhau không.
   *
   * Validator được đặt ở FormGroup nên lỗi
   * passwordMismatch nằm trên passwordForm.
   */
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    // Chưa nhập đủ thì để Validators.required xử lý
    if (!password || !confirmPassword) {
      return null;
    }

    // Hai mật khẩu giống nhau
    if (password === confirmPassword) {
      return null;
    }

    // Hai mật khẩu khác nhau
    return {
      passwordMismatch: true,
    };
  }

  /**
   * Kiểm tra lỗi mật khẩu nhập lại không khớp.
   *
   * Dùng trong template:
   * @if (passwordMismatch) { ... }
   */
  get passwordMismatch(): boolean {
    return this.passwordForm.hasError('passwordMismatch') && this.f.confirmPassword.touched;
  }

  // ================= PASSWORD TOGGLE =================

  togglePassword(): void {
    this.showPassword.update((value) => !value);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update((value) => !value);
  }

  // ================= SUBMIT =================

  onContinue(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const value = this.passwordForm.getRawValue();

    console.log('New password:', value.password);

    this.router.navigate(['/login']);
  }
}
