import { Component } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usernameControl = new UntypedFormControl("", Validators.required);
  passwordControl = new UntypedFormControl("", [Validators.required]);

  constructor(private authService: AuthService, private snackBar: MatSnackBar) { }

  isLoggedIn(): boolean {
    return !!this.authService.user.value;
  }

  getLoggedInUsername(): string {
    if (this.authService.user.value) {
      return this.authService.user.value.username;
    }
    return "n/a"
  }

  getLoggedInName(): string {
    if (this.authService.user.value && this.authService.user.value.name) {
      return this.authService.user.value.name;
    }
    return "n/a"
  }

  onLogin(): void {
    if (this.usernameControl.valid && this.passwordControl.valid) {
      this.authService.login(this.usernameControl.value, this.passwordControl.value).subscribe(
        result => {
          this.snackBar.open(`Successfully logged in as user '${this.getLoggedInUsername()}'!`, undefined, {
            duration: 5000,
            panelClass: ['success-snackbar']
          });

          this.usernameControl.reset();
          this.passwordControl.reset();
        }
      );
    }
  }

  onLogout(): void {
    this.authService.logout();
  }

}
