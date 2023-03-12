import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';
import { UserInfo } from '../../shared/user.model';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginAttempted = false;
  loginSuccessful = false;

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
    if (this.usernameControl.valid && this.passwordControl.valid) {
      this.loginAttempted = false;
      this.loginSuccessful = false;
      this.authService.login(this.usernameControl.value, this.passwordControl.value).subscribe(
        result => {
          this.loginAttempted = true;
          this.loginSuccessful = true;

          this.usernameControl.reset();
          this.passwordControl.reset();
        },
        errorMessage => {
          this.loginAttempted = true;
          this.loginSuccessful = false;
        });
    }
  }

  onLogout(): void {
    this.authService.logout();
  }

}
