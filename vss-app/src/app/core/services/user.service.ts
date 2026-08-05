import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  private readonly STORAGE_KEY = 'users';

  getUsers(): Observable<User[]> {
    const storage = localStorage.getItem(this.STORAGE_KEY);

    if (storage) {
      return of(JSON.parse(storage));
    }

    return this.http.get<User[]>('/data/users.json').pipe(
      tap((users) => {
        this.saveUsers(users);
      })
    );
  }

  saveUsers(users: User[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
  }

  clearUsers() {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}