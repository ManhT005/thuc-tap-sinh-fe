import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { User } from '../models/user.model';
import {
  ReqresUser,
  ReqresUsersResponse,
} from '../models/reqres-user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  private readonly API = `${environment.apiUrl}/users`;

  private readonly headers = new HttpHeaders({
    'x-api-key': environment.apiKey,
  });

  getUsers(): Observable<User[]> {
    return this.http
      .get<ReqresUsersResponse>(`${this.API}?page=1`, {
        headers: this.headers,
      })
      .pipe(
        map((res) => res.data.map((u) => this.toUser(u)))
      );
  }

  createUser(user: User): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(
      this.API,
      {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        avatar: user.avatar,
      },
      {
        headers: this.headers,
      }
    );
  }

  updateUser(user: User): Observable<any> {
    return this.http.put(
      `${this.API}/${user.id}`,
      {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        avatar: user.avatar,
      },
      {
        headers: this.headers,
      }
    );
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`, {
      headers: this.headers,
    });
  }

  private toUser(user: ReqresUser): User {
    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      avatar: user.avatar,
    };
  }
}