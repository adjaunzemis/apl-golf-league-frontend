import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AngularMaterialModule } from '../angular-material.module';
import { ErrorModule } from '../shared/error/error.module';
import { FlightMatchCreateComponent } from './flight-match-create/flight-match-create.component';
import { FlightMatchScorecardComponent } from './flight-match-create/flight-match-scorecard.component';
import { DivisionsModule } from '../divisions/divisions.module';
import { PaymentsModule } from '../payments/payments.module';
import { ScorecardModule } from '../shared/scorecard/scorecard.module';
import { FlightCreateComponent } from './flight-create/flight-create.component';
import { PrimeNGModule } from '../primeng.module';

@NgModule({
  declarations: [FlightMatchScorecardComponent, FlightMatchCreateComponent, FlightCreateComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AngularMaterialModule,
    ScorecardModule,
    ErrorModule,
    DivisionsModule,
    PaymentsModule,
    PrimeNGModule,
  ],
})
export class FlightsModule {}
