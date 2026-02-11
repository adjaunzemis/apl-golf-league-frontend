import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PrimeNGModule } from '../primeng.module';
import { ScorecardModule } from '../shared/scorecard/scorecard.module';
import { DivisionListComponent } from './division-list/division-list.component';

@NgModule({
  declarations: [DivisionListComponent],
  imports: [CommonModule, RouterModule, PrimeNGModule, ScorecardModule],
  exports: [DivisionListComponent],
})
export class DivisionsModule {}
