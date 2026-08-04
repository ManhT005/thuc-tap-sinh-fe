import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-first-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './first-login.html',
  styleUrl: './first-login.scss',
})
export class FirstLogin {
  private fb = inject(FormBuilder);
  constructor() {}

  firstLoginForm = this.fb.group(
    {
      newPassword: [
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

  get f() {
    return this.firstLoginForm.controls;
  }

  passwordMatchValidator(form: any) {
    const password = form.get('newPassword')?.value;
    const confirm = form.get('confirmPassword')?.value;

    return password === confirm ? null : { passwordMismatch: true };
  }

  onContinue() {
    if (this.firstLoginForm.invalid) {
      this.firstLoginForm.markAllAsTouched();
      return;
    }

    console.log(this.firstLoginForm.value);
  }
}
