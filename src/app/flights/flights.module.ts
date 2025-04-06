import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../angular-material.module';
import { GolferStatisticsComponent } from './golfer-statistics/golfer-statistics.component';
import { ErrorModule } from '../shared/error/error.module';
import { FlightMatchCreateComponent } from './flight-match-create/flight-match-create.component';
import { FlightMatchScorecardComponent } from './flight-match-create/flight-match-scorecard.component';
import { DivisionsModule } from '../divisions/divisions.module';
import { PaymentsModule } from '../payments/payments.module';
import { ScorecardModule } from '../shared/scorecard/scorecard.module';
import { PlayoffBracketComponent } from './playoff-bracket/playoff-bracket.component';
import { FlightCreateComponent } from './flight-create/flight-create.component';

@NgModule({
  declarations: [
    GolferStatisticsComponent,
    FlightMatchScorecardComponent,
    FlightMatchCreateComponent,
    PlayoffBracketComponent,
    FlightCreateComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule,
    ScorecardModule,
    ErrorModule,
    DivisionsModule,
    PaymentsModule,
  ],
})
export class FlightsModule {}
