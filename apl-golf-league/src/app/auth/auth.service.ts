import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Subject } from "rxjs";

import { environment } from './../../environments/environment';
import { User } from "../shared/user.model";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new Subject<User>();

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
