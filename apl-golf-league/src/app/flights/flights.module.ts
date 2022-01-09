import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AngularMaterialModule } from "../angular-material.module";
import { MatchesModule } from "../matches/matches.module";
import { FlightListComponent } from "./flight-list/flight-list.component";
import { FlightsHomeComponent } from './flights-home/flights-home.component';
import { TeamHomeComponent } from "./team-home/team-home.component";
import { TeamScheduleComponent } from './team-schedule/team-schedule.component';
import { TeamRosterComponent } from './team-roster/team-roster.component';


@NgModule({
  declarations: [
    FlightListComponent,
    FlightsHomeComponent,
    TeamHomeComponent,
    TeamScheduleComponent,
    TeamRosterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule,
    MatchesModule
  ]
})
export class FlightsModule {}
