import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PrimeNGModule } from '../primeng.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule, FormsModule, PrimeNGModule],
  exports: [],
})
export class PaymentsModule {}
