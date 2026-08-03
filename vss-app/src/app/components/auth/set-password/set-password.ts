import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-set-password',
  imports: [CommonModule, RouterModule],
  templateUrl: './set-password.html',
})
export class SetPassword {
  constructor(private router: Router) {}

  onContinue() {
    this.router.navigate(['/login']);
  }
}
