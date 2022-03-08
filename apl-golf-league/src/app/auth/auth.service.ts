import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { tap, take, exhaustMap } from "rxjs/operators";

import { environment } from './../../environments/environment';
import { User, UserInfo } from "../shared/user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private static LOCAL_STORAGE_USER = 'aplGolfUserData';

  user = new BehaviorSubject<User|null>(null);

  constructor(private http: HttpClient, private router: Router) { }

  login(username: string, password: string) {
    const body = new HttpParams()
      .set('username', username)
      .set('password', password)
      .set('grant_type', 'password');
    return this.http.post<AuthResponseData>(environment.apiUrl + `users/token`, body)
      .pipe(tap(resData => {
        const expirationDate = new Date(new Date().getTime() + resData.access_token_expires_in * 1000);
        const user = new User(resData.id, resData.username, resData.email, resData.name, resData.disabled, resData.access_token, expirationDate);
        this.user.next(user);
        localStorage.setItem(AuthService.LOCAL_STORAGE_USER, JSON.stringify(user));
      }));
  }

  autoLogin() {
    const userDataStr = localStorage.getItem(AuthService.LOCAL_STORAGE_USER);
    if (!userDataStr) {
      return;
    }

    const userData: {id: string, username: string, email: string, name: string, disabled: string, _token: string,  _tokenExpirationDate: Date} = JSON.parse(userDataStr);
    const loadedUser: User = new User(
      +userData.id,
      userData.username,
      userData.email,
      userData.name,
      userData.disabled === 'true',
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
    }
  }

  logout(): void {
    this.user.next(null);
    this.router.navigate([`/auth/login`]);
    localStorage.removeItem(AuthService.LOCAL_STORAGE_USER);
  }

  getUserInfo() {
    return this.user.pipe(take(1), exhaustMap(user => {
      return this.http.get<UserInfo>(environment.apiUrl + `users/me`);
    }));
  }

}

export interface AuthResponseData {
  id: number
  username: string
  email: string
  name: string
  disabled: boolean
  access_token: string
  access_token_expires_in: number
  token_type: string
}
