import { Component, inject } from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { CommonModule } from '@angular/common';

import { AuthService } from '../auth.service';
import { NotificationService } from 'src/app/notifications/notification.service';

@Component({
  selector: 'app-user-manage',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    FloatLabel,
    PasswordModule,
  ],
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.css'],
})
export class UserManageComponent {
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  manageFormGroup = new FormGroup(
    {
      usernameControl: new FormControl('', Validators.required),
      currentPasswordControl: new FormControl('', Validators.required),
      newPasswordControl: new FormControl('', Validators.required),
      confirmNewPasswordControl: new FormControl('', Validators.required),
    },
    { validators: this.passwordMatchValidator() },
  );

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const newPassword = control.get('newPasswordControl');
      const confirmNewPassword = control.get('confirmNewPasswordControl');

      if (!newPassword || !confirmNewPassword) {
        return null;
      }

      return newPassword.value === confirmNewPassword.value ? null : { passwordMismatch: true };
    };
  }

  onSubmit(): void {
    if (this.manageFormGroup.valid) {
      const {
        usernameControl,
        currentPasswordControl,
        newPasswordControl,
      } = this.manageFormGroup.value;

      this.authService
        .changePassword(usernameControl!, currentPasswordControl!, newPasswordControl!)
        .subscribe({
          next: () => {
            this.notificationService.showSuccess(
              'Success',
              'Password changed successfully!',
              5000,
            );
            this.manageFormGroup.reset();
          },
          error: (err) => {
            this.notificationService.showError(
              'Error',
              'Failed to change password: ' + (err.error?.detail || err.message),
              5000,
            );
          },
        });
    }
  }
}
