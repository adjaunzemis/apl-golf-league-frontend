import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { tap, take, exhaustMap } from 'rxjs/operators';

import { environment } from './../../environments/environment';
import { User, UserInfo } from '../shared/user.model';
import { NotificationService } from '../notifications/notification.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private static LOCAL_STORAGE_USER = 'aplGolfUserData';
  private tokenExpirationTimer: ReturnType<typeof setTimeout> | null = null;

  user = new BehaviorSubject<User | null>(null);

  private notificationService = inject(NotificationService);
  private http = inject(HttpClient);
  private router = inject(Router);

  login(username: string, password: string) {
    const body = new HttpParams()
      .set('username', username)
      .set('password', password)
      .set('grant_type', 'password');
    return this.http.post<AuthResponseData>(environment.apiUrl + `users/token`, body).pipe(
      tap((resData) => {
        const expirationDate = new Date(
          new Date().getTime() + resData.access_token_expires_in * 1000,
        );
        const user = new User(
          resData.id,
          resData.username,
          resData.email,
          resData.name,
          resData.disabled,
          resData.is_admin,
          resData.edit_flights,
          resData.edit_tournaments,
          resData.edit_payments,
          resData.access_token,
          expirationDate,
        );
        this.user.next(user);
        this.autoLogout(resData.access_token_expires_in * 1000);
        localStorage.setItem(AuthService.LOCAL_STORAGE_USER, JSON.stringify(user));
      }),
    );
  }

  autoLogin() {
    const userDataStr = localStorage.getItem(AuthService.LOCAL_STORAGE_USER);
    if (!userDataStr) {
      return;
    }

    const userData: {
      id: string;
      username: string;
      email: string;
      name: string;
      disabled: boolean;
      is_admin: boolean;
      edit_flights: boolean;
      edit_tournaments: boolean;
      edit_payments: boolean;
      _token: string;
      _tokenExpirationDate: Date;
    } = JSON.parse(userDataStr);
    const loadedUser: User = new User(
      +userData.id,
      userData.username,
      userData.email,
      userData.name,
      userData.disabled,
      userData.is_admin,
      userData.edit_flights,
      userData.edit_tournaments,
      userData.edit_payments,
      userData._token,
      new Date(userData._tokenExpirationDate),
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout(): void {
    this.user.next(null);
    this.router.navigate([`/auth/login`]);
    localStorage.removeItem(AuthService.LOCAL_STORAGE_USER);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
    this.notificationService.showInfo('Logout', `Successfully logged out!`, 5000);
  }

  autoLogout(expirationDuration: number): void {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  getUserInfo() {
    return this.user.pipe(
      take(1),
      exhaustMap(() => {
        return this.http.get<UserInfo>(environment.apiUrl + `users/me`);
      }),
    );
  }

  changePassword(username: string, oldPassword: string, newPassword: string) {
    const body = new HttpParams()
      .set('username', username)
      .set('password', oldPassword)
      .set('client_secret', newPassword)
      .set('grant_type', 'password');
    return this.http.post<UserInfo>(environment.apiUrl + `users/change-password`, body);
  }
}

export interface AuthResponseData {
  id: number;
  username: string;
  email: string;
  name: string;
  disabled: boolean;
  is_admin: boolean;
  edit_flights: boolean;
  edit_tournaments: boolean;
  edit_payments: boolean;
  access_token: string;
  access_token_expires_in: number;
  token_type: string;
}
