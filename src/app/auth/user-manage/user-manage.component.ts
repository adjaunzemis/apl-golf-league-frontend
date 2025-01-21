import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';
import { User } from '../../shared/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.css'],
})
export class UserManageComponent implements OnInit, OnDestroy {
  private userSub: Subscription;
  isAuthenticated: boolean = false;
  currentUser: User | null = null;

  usernameControl = new UntypedFormControl('', Validators.required);
  oldPasswordControl = new UntypedFormControl('', [Validators.required]);
  newPasswordControl = new UntypedFormControl('', [Validators.required, Validators.minLength(6)]);
  newPasswordRepeatControl = new UntypedFormControl('', [Validators.required, Validators.minLength(6)]);

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !user ? false : true;
      if (this.isAuthenticated) {
        this.currentUser = user;

        this.usernameControl.setValue(this.currentUser?.username);
      }
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

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

  checkControlValues(): boolean {
    return (
      this.usernameControl.valid &&
      this.oldPasswordControl.valid &&
      this.newPasswordControl.valid &&
      this.newPasswordRepeatControl.valid &&
      this.newPasswordControl.value === this.newPasswordRepeatControl.value
    );
  }

  onSubmit(): void {
    if (this.checkControlValues()) {
      this.authService
        .changePassword(this.usernameControl.value, this.oldPasswordControl.value, this.newPasswordControl.value)
        .subscribe((result) => {
          console.log(`[UserManageComponent] Successfully changed password!`);
          this.snackBar.open(`Successfully changed password! Login with new password.`, undefined, {
            duration: 5000,
            panelClass: ['success-snackbar'],
          });
          this.authService.logout();
        });
    }
  }

  onLogout(): void {
    this.authService.logout();
  }
}
