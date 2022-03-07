import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { UserInfo } from '../../shared/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  userInfo: UserInfo;

  usernameControl = new FormControl("", Validators.required);
  passwordControl = new FormControl("", [Validators.required, Validators.minLength(6)]);

  constructor(private authService: AuthService, private router: Router) { }

  onLogin(): void {
    this.authService.login(this.usernameControl.value, this.passwordControl.value).subscribe(
      result => {
        console.log("Login successful!");
        this.usernameControl.reset();
        this.passwordControl.reset();
      },
      errorMessage => {
        console.error("Login failed!");
        console.log(errorMessage); // TODO: handle error
      });
  }

  onGetUserInfo(): void {
    this.authService.getUserInfo().subscribe(info => this.userInfo = info);
  }

}
