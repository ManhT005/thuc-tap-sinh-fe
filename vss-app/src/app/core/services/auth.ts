import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly KEY = 'isLoggedIn';
  
  login(){
    localStorage.setItem(this.KEY, 'true');
  }

  logout(){
    localStorage.removeItem(this.KEY);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.KEY) === 'true';
  }
}
