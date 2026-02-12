import { Component, inject } from '@angular/core';

import { FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';

import { AuthService } from '../auth.service';
import { NotificationService } from 'src/app/notifications/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, CardModule, ButtonModule, InputTextModule, FloatLabel],
})
export class LoginComponent {
  loginFormGroup = new FormGroup({
    usernameControl: new FormControl('', Validators.required),
    passwordControl: new FormControl('', Validators.required),
  });

  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  isLoggedIn(): boolean {
    return !!this.authService.user.value;
  }

  getLoggedInUsername(): string {
    if (this.authService.user.value) {
      return this.authService.user.value.username;
    }
    return 'n/a';
  }

  getLoggedInName(): string {
    if (this.authService.user.value && this.authService.user.value.name) {
      return this.authService.user.value.name;
    }
    return 'n/a';
  }

  onLogin(): void {
    if (this.loginFormGroup.value.usernameControl && this.loginFormGroup.value.passwordControl) {
      this.authService
        .login(this.loginFormGroup.value.usernameControl, this.loginFormGroup.value.passwordControl)
        .subscribe(() => {
          this.notificationService.showSuccess(
            'Login Successful',
            `Successfully logged in as user '${this.getLoggedInUsername()}'!`,
            5000,
          );

          this.loginFormGroup.reset();
        });
    }
  }

  onLogout(): void {
    this.authService.logout();
  }
}
