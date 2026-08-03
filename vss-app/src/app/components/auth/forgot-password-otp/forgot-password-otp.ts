import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-forgot-password-otp',
  imports: [CommonModule, RouterModule],
  templateUrl: './forgot-password-otp.html',
  styleUrl: './forgot-password-otp.scss',
})
export class ForgotPasswordOtp {
  constructor(private router: Router) {}

  onContinue() {
    this.router.navigate(['/set-password']);
  }
}
