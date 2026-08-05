import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class Topbar {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  showMenu = signal(false);

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.showMenu.update(v => !v);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  @HostListener('document:click')
  closeMenu() {
    this.showMenu.set(false);
  }
}