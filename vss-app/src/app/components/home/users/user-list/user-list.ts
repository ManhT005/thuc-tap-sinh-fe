import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

import { UserService } from '../../../../core/services/user.service';
import { CreateUserResponse, User } from '../../../../core/models/user.model';
import { UserForm } from '../../components/user-form/user-form';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    UserForm,

    NzButtonModule,
    NzInputModule,
    NzTableModule,
    NzAvatarModule,
    NzIconModule,
    NzTooltipModule,
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList implements OnInit {
  private userService = inject(UserService);

  users = signal<User[]>([]);
  showModal = signal(false);
  selectedUser = signal<User | null>(null);

  ngOnInit(): void {
    this.loadUsers();
  }

  /**
   * RxJS Observable:
   * Nhận danh sách User bất đồng bộ từ API.
   */
  loadUsers(): void {
    const users$: Observable<User[]> = this.userService.getUsers();

    users$.subscribe({
      next: (users: User[]) => {
        this.users.set(users);
      },

      error: (error) => {
        console.error('Lỗi khi lấy danh sách user:', error);
      },
    });
  }

  openAdd(): void {
    this.selectedUser.set(null);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  editUser(user: User): void {
    this.selectedUser.set(user);
    this.showModal.set(true);
  }

  deleteUser(id: number): void {
    /**
     * Observable<void> từ API xóa user.
     */
    const deleteUser$: Observable<void> = this.userService.deleteUser(id);

    deleteUser$.subscribe({
      next: () => {
        this.users.update((users) => users.filter((user) => user.id !== id));
      },

      error: (error) => {
        console.error('Lỗi khi xóa user:', error);
      },
    });
  }

  saveUser(user: User): void {
    if (!user.avatar.trim()) {
      user.avatar = 'https://reqres.in/img/faces/1-image.jpg';
    }

    const existed = this.users().some((currentUser) => currentUser.id === user.id);

    if (existed) {
      this.updateUser(user);
    } else {
      this.createUser(user);
    }
  }

  /**
   * Observable từ API cập nhật User.
   */
  private updateUser(user: User): void {
    const updateUser$: Observable<User> = this.userService.updateUser(user);

    updateUser$.subscribe({
      next: () => {
        this.users.update((users) =>
          users.map((currentUser) => (currentUser.id === user.id ? user : currentUser)),
        );

        this.closeModal();
      },

      error: (error) => {
        console.error('Lỗi khi cập nhật user:', error);
      },
    });
  }

  /**
   * Observable từ API tạo User.
   */
  private createUser(user: User): void {
    const createUser$: Observable<CreateUserResponse> = this.userService.createUser(user);

    createUser$.subscribe({
      next: (response) => {
        this.users.update((users) => [
          ...users,
          {
            ...user,
            id: Number(response.id),
          },
        ]);

        this.closeModal();
      },

      error: (error) => {
        console.error('Lỗi khi tạo user:', error);
      },
    });
  }
}
