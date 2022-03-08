import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { BehaviorSubject, Subject } from "rxjs";
import { tap, take, exhaustMap } from "rxjs/operators";

import { environment } from './../../environments/environment';
import { User, UserInfo } from "../shared/user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<User|null>(null);

  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    const body = new HttpParams()
      .set('username', username)
      .set('password', password)
      .set('grant_type', 'password');
    return this.http.post<AuthResponseData>(environment.apiUrl + `users/token`, body)
      .pipe(tap(resData => {
        const expirationDate = new Date(new Date().getTime() + resData.access_token_expires_in * 1000);
        const user = new User(resData.id, resData.username, resData.email, resData.name, resData.access_token, expirationDate);
        this.user.next(user);
      }));
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
  access_token: string
  access_token_expires_in: number
  token_type: string
}
