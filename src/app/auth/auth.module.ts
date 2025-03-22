import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../angular-material.module';
import { ErrorModule } from '../shared/error/error.module';
import { UserManageComponent } from './user-manage/user-manage.component';
import { UserHomeComponent } from './user-home/user-home.component';

@NgModule({
  declarations: [UserManageComponent, UserHomeComponent],
  imports: [CommonModule, RouterModule, AngularMaterialModule, ErrorModule],
})
export class AuthModule {}
