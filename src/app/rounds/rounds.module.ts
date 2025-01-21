import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../angular-material.module';
import { ScorecardModule } from '../shared/scorecard/scorecard.module';
import { RoundScorecardComponent } from './round-scorecard/round-scorecard.component';

@NgModule({
  declarations: [RoundScorecardComponent],
  imports: [CommonModule, RouterModule, AngularMaterialModule, ScorecardModule],
})
export class RoundsModule {}
