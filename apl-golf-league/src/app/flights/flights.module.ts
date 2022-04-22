import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AngularMaterialModule } from "../angular-material.module";
import { MatchesModule } from "../matches/matches.module";
import { TeamHomeComponent } from "./team-home/team-home.component";
import { TeamScheduleComponent } from './team-schedule/team-schedule.component';
import { GolferStatisticsComponent } from './golfer-statistics/golfer-statistics.component';
import { FlightHomeComponent } from './flight-home/flight-home.component';
import { FlightStandingsComponent } from './flight-standings/flight-standings.component';
import { FlightHistoryComponent } from './flight-history/flight-history.component';
import { FlightSignupComponent } from './flight-signup/flight-signup.component';
import { ErrorModule } from "../shared/error/error.module";
import { FlightScheduleComponent } from './flight-schedule/flight-schedule.component';
import { FlightScheduleMatrixComponent } from "./flight-schedule-matrix/flight-schedule-matrix.component";
import { FlightMatchCreateComponent } from './flight-match-create/flight-match-create.component';
import { FlightMatchScorecardComponent } from './flight-match-create/flight-match-scorecard.component';
import { DivisionsModule } from "../divisions/divisions.module";
import { PaymentsModule } from "../payments/payments.module";
import { ScorecardModule } from "../shared/scorecard/scorecard.module";

@NgModule({
  declarations: [
    TeamHomeComponent,
    TeamScheduleComponent,
    GolferStatisticsComponent,
    FlightHomeComponent,
    FlightStandingsComponent,
    FlightHistoryComponent,
    FlightSignupComponent,
    FlightScheduleComponent,
    FlightScheduleMatrixComponent,
    FlightMatchScorecardComponent,
    FlightMatchCreateComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule,
    MatchesModule,
    ScorecardModule,
    ErrorModule,
    DivisionsModule,
    PaymentsModule
  ]
})
export class FlightsModule {}
