import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AngularMaterialModule } from "../angular-material.module";
import { FlightListComponent } from "./flight-list/flight-list.component";
import { FlightsHomeComponent } from './flights-home/flights-home.component';
import { TeamHomeComponent } from "./team-home/team-home.component";
import { TeamScheduleComponent } from './team-schedule/team-schedule/team-schedule.component';


@NgModule({
  declarations: [
    FlightListComponent,
    FlightsHomeComponent,
    TeamHomeComponent,
    TeamScheduleComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule
  ]
})
export class FlightsModule {}
