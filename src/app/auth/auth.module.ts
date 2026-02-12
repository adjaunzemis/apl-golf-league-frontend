import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ErrorModule } from '../shared/error/error.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule, ErrorModule],
})
export class AuthModule {}
