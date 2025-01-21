import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from 'src/app/angular-material.module';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';

@NgModule({
  declarations: [ErrorDialogComponent],
  imports: [CommonModule, RouterModule, AngularMaterialModule],
  exports: [ErrorDialogComponent],
})
export class ErrorModule {}
