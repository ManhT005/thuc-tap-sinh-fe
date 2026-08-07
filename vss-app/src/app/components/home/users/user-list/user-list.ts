import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';

import { UserForm } from '../../components/user-form/user-form';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, UserForm],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList {
  private userService = inject(UserService);

  users = signal<User[]>([]);
  showModal = signal(false);
  selectedUser = signal<User | null>(null);

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (users) => this.users.set(users),
      error: console.error,
    });
  }

  openAdd() {
    this.selectedUser.set(null);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  editUser(user: User) {
    this.selectedUser.set(user);
    this.showModal.set(true);
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.users.update((users) => users.filter((u) => u.id !== id));
      },
      error: console.error,
    });
  }

  saveUser(user: User) {
    if (!user.avatar.trim()) {
      user.avatar =
        'https://reqres.in/img/faces/1-image.jpg';
    }

    const existed = this.users().some((u) => u.id === user.id);

    if (existed) {
      this.userService.updateUser(user).subscribe({
        next: () => {
          this.users.update((users) =>
            users.map((u) => (u.id === user.id ? user : u))
          );

          this.closeModal();
        },
        error: console.error,
      });
    } else {
      this.userService.createUser(user).subscribe({
        next: (res) => {
          this.users.update((users) => [
            ...users,
            {
              ...user,
              id: Number(res.id),
            },
          ]);

          this.closeModal();
        },
        error: console.error,
      });
    }
  }
}