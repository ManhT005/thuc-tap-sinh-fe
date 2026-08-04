import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserService } from '../../../../core/service/user.service';
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
    this.userService.getUsers().subscribe({
      next: (users) => {
        console.log(users);
        this.users.set(users);
      },
      error: (err) => console.error(err),
    });
  }

  openAdd() {
    this.selectedUser.set(null);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  trackById(index: number, user: User): number {
    return user.id;
  }

  editUser(user: User) {
    this.selectedUser.set(user);
    this.showModal.set(true);
  }
  deleteUser(id: number) {
    this.users.update((users) => users.filter((user) => user.id !== id));
  }

  saveUser(user: User) {}
}
