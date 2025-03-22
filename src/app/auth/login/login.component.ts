import { Component, inject } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';

import { AuthService } from '../auth.service';
import { NotificationService } from 'src/app/notifications/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false,
})
export class LoginComponent {
  usernameControl = new UntypedFormControl('', Validators.required);
  passwordControl = new UntypedFormControl('', [Validators.required]);

  private authService = inject(AuthService);
  private notificationService = inject(NotificationService)

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
    if (this.usernameControl.valid && this.passwordControl.valid) {
      this.authService
        .login(this.usernameControl.value, this.passwordControl.value)
        .subscribe(() => {
          this.notificationService.showSuccess(
            "Login Successful",
            `Successfully logged in as user '${this.getLoggedInUsername()}'!`,
            5000
          );

          this.usernameControl.reset();
          this.passwordControl.reset();
        });
    }
  }

  onLogout(): void {
    this.authService.logout();
  }
}
