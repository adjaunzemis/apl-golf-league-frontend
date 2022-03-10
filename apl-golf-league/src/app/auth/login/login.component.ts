import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';
import { UserInfo } from '../../shared/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usernameControl = new FormControl("", Validators.required);
  passwordControl = new FormControl("", [Validators.required, Validators.minLength(6)]);

  constructor(private authService: AuthService) { }

  isLoggedIn(): boolean {
    return !!this.authService.user.value;
  }

  getLoggedInUsername(): string {
    if (this.authService.user.value) {
      return this.authService.user.value.username;
    }
    return "n/a"
  }

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

  onLogout(): void {
    this.authService.logout();
  }

}
