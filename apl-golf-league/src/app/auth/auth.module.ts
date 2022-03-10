import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../angular-material.module';
import { ErrorModule } from '../shared/error/error.module';
import { LoginComponent } from './login/login.component';
import { UserHomeComponent } from './user-home/user-home.component';

@NgModule({
  declarations: [
    LoginComponent,
    UserHomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule,
    ErrorModule
  ]
})
export class AuthModule { }
