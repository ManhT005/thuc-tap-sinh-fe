import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  standalone: true,
  selector: 'app-forgot-password-otp',
  imports: [ReactiveFormsModule, RouterModule, NzFormModule, NzInputModule, NzButtonModule],
  templateUrl: './forgot-password-otp.html',
  styleUrl: './forgot-password-otp.scss',
})
export class ForgotPasswordOtp {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  otpForm = this.fb.nonNullable.group({
    otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
  });

  get f() {
    return this.otpForm.controls;
  }

  onContinue(): void {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    const otp = this.otpForm.getRawValue().otp;

    console.log('OTP:', otp);

    this.router.navigate(['/set-password']);
  }

  resendOtp(): void {
    console.log('Gửi lại OTP');
  }
}
