import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-first-login',
  imports: [CommonModule, RouterModule],
  templateUrl: './first-login.html',
})
export class FirstLogin {
  constructor(private router: Router) {}

  onContinue() {
    this.router.navigate(['/login']);
  }
}
