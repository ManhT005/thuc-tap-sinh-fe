import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  Subject,
  Subscription,
  combineLatest,
  of,
} from 'rxjs';

import {
  catchError,
  concatMap,
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  startWith,
  switchMap,
  take,
  takeUntil,
  throttleTime,
} from 'rxjs/operators';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

import { UserService } from '../../../../core/services/user.service';
import { CreateUserResponse, User } from '../../../../core/models/user.model';

import { UserForm } from '../../components/user-form/user-form';

interface UserAction {
  type: 'create' | 'update' | 'delete';
  userId: number;
}

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
export class UserList implements OnInit, OnDestroy {
  private userService = inject(UserService);

  // ============================================================
  // UI STATE
  // ============================================================

  users = signal<User[]>([]);
  selectedUser = signal<User | null>(null);
  showModal = signal(false);

  loading = signal(false);
  errorMessage = signal('');

  // ============================================================
  // RXJS SUBJECTS
  // ============================================================

  private searchSubject = new BehaviorSubject<string>('');
  private refreshSubject = new Subject<void>();
  private actionSubject = new ReplaySubject<UserAction>(5);
  private destroySubject = new Subject<void>();
  private subscriptions = new Subscription();
  private allUsers: User[] = [];
  private usersSubject = new BehaviorSubject<User[]>([]);

  // ============================================================
  // LIFECYCLE
  // ============================================================

  ngOnInit(): void {
    this.setupUsers();
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
    this.searchSubject.complete();
    this.refreshSubject.complete();
    this.actionSubject.complete();
    this.usersSubject.complete();
    this.subscriptions.unsubscribe();
  }

  // ============================================================
  // LOAD + REFRESH USERS
  // ============================================================

  private setupUsers(): void {
    const users$: Observable<User[]> = this.refreshSubject.pipe(
      startWith(undefined),
      throttleTime(1000),
      switchMap(() => {
        this.loading.set(true);
        this.errorMessage.set('');

        return this.userService.getUsers().pipe(
          map((users) =>
            users.map((user) => ({
              ...user,
              avatar: user.avatar || 'https://reqres.in/img/faces/1-image.jpg',
            })),
          ),

          catchError((error) => {
            console.error('Lỗi khi lấy danh sách user:', error);
            this.errorMessage.set('Không thể tải danh sách người dùng.');
            return of([]);
          }),
          finalize(() => {
            this.loading.set(false);
          }),
        );
      }),
      takeUntil(this.destroySubject),
    );

    const subscription = users$.subscribe({
      next: (users) => {
        this.allUsers = users;
        this.usersSubject.next(users);
      },
      error: (error) => {
        console.error('Observable error:', error);
      },
    });
    this.subscriptions.add(subscription);
  }
  refreshUsers(): void {
    this.refreshSubject.next();
  }

  // ============================================================
  // SEARCH
  // ============================================================

  private setupSearch(): void {
    const filteredUsers$: Observable<User[]> = combineLatest([
      this.usersSubject,

      this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()),
    ]).pipe(
      map(([users, keyword]) => {
        const searchText = keyword.trim().toLowerCase();
        return users.filter((user) => {
          if (!searchText) {
            return true;
          }

          const firstName = user.first_name?.toLowerCase() ?? '';
          const lastName = user.last_name?.toLowerCase() ?? '';
          const email = user.email?.toLowerCase() ?? '';
          return (
            firstName.includes(searchText) ||
            lastName.includes(searchText) ||
            email.includes(searchText)
          );
        });
      }),

      takeUntil(this.destroySubject),
    );

    const subscription = filteredUsers$.subscribe({
      next: (users) => {
        this.users.set(users);
      },
    });

    this.subscriptions.add(subscription);
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
  }

  // ============================================================
  // MODAL
  // ============================================================

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

  // ============================================================
  // SAVE USER
  // ============================================================

  saveUser(user: User): void {
    if (!user.avatar.trim()) {
      user.avatar = 'https://reqres.in/img/faces/1-image.jpg';
    }

    const existed = this.allUsers.some((currentUser) => currentUser.id === user.id);

    if (existed) {
      this.updateUser(user);
    } else {
      this.createUser(user);
    }
  }

  // ============================================================
  // CREATE USER
  // ============================================================

  private createUser(user: User): void {
    const createUser$: Observable<CreateUserResponse> = this.userService.createUser(user);

    createUser$
      .pipe(
        map((response) => ({
          ...user,
          id: Number(response.id),
        })),
        catchError((error) => {
          console.error('Lỗi khi tạo user:', error);
          this.errorMessage.set('Không thể tạo người dùng.');
          return of(null);
        }),
        filter((createdUser): createdUser is User => createdUser !== null),
        takeUntil(this.destroySubject),
      )
      .subscribe({
        next: (createdUser) => {
          this.allUsers = [...this.allUsers, createdUser];
          this.usersSubject.next(this.allUsers);
          this.actionSubject.next({
            type: 'create',
            userId: createdUser.id,
          });

          this.closeModal();
        },
      });
  }

  // ============================================================
  // UPDATE USER
  // ============================================================

  private updateUser(user: User): void {
    this.userService
      .updateUser(user)
      .pipe(
        map(() => user),
        catchError((error) => {
          console.error('Lỗi khi cập nhật user:', error);
          this.errorMessage.set('Không thể cập nhật người dùng.');
          return of(null);
        }),
        filter((updatedUser): updatedUser is User => updatedUser !== null),
        takeUntil(this.destroySubject),
      )

      .subscribe({
        next: (updatedUser) => {
          this.allUsers = this.allUsers.map((currentUser) =>
            currentUser.id === updatedUser.id ? updatedUser : currentUser,
          );

          this.usersSubject.next(this.allUsers);

          this.actionSubject.next({
            type: 'update',
            userId: updatedUser.id,
          });

          this.closeModal();
        },
      });
  }

  // ============================================================
  // DELETE USER
  // ============================================================

  deleteUser(id: number): void {
    of(id)
      .pipe(
        concatMap((userId) => this.userService.deleteUser(userId).pipe(map(() => userId))),
        catchError((error) => {
          console.error('Lỗi khi xóa user:', error);
          this.errorMessage.set('Không thể xóa người dùng.');
          return of(null);
        }),
        filter((deletedId): deletedId is number => deletedId !== null),
        takeUntil(this.destroySubject),
      )

      .subscribe({
        next: (deletedId) => {
          this.allUsers = this.allUsers.filter((user) => user.id !== deletedId);
          this.usersSubject.next(this.allUsers);
          this.actionSubject.next({
            type: 'delete',
            userId: deletedId,
          });
        },
      });
  }

  getLatestAction(): void {
    this.actionSubject.pipe(take(1)).subscribe({
      next: (action) => {
        console.log('Thao tác gần nhất:', action);
      },
    });
  }
}
