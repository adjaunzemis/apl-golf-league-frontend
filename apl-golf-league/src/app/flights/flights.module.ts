import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AngularMaterialModule } from "../angular-material.module";
import { MatchesModule } from "../matches/matches.module";
import { TeamHomeComponent } from "./team-home/team-home.component";
import { TeamScheduleComponent } from './team-schedule/team-schedule.component';
import { TeamRosterComponent } from './team-roster/team-roster.component';
import { GolferStatisticsComponent } from './golfer-statistics/golfer-statistics.component';
import { FlightHomeComponent } from './flight-home/flight-home.component';
import { FlightStandingsComponent } from './flight-standings/flight-standings.component';
import { FlightHistoryComponent } from './flight-history/flight-history.component';
import { FlightSignupComponent } from './flight-signup/flight-signup.component';
import { AddTeamGolferComponent } from "../shared/add-team-golfer/add-team-golfer.component";

@NgModule({
  declarations: [
    TeamHomeComponent,
    TeamScheduleComponent,
    TeamRosterComponent,
    GolferStatisticsComponent,
    FlightHomeComponent,
    FlightStandingsComponent,
    FlightHistoryComponent,
    FlightSignupComponent,
    AddTeamGolferComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule,
    MatchesModule
  ]
})
export class FlightsModule {}
