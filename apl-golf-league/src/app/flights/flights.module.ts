import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AngularMaterialModule } from "../angular-material.module";
import { FlightListComponent } from "./flight-list/flight-list.component";
import { FlightsHomeComponent } from './flights-home/flights-home.component';


@NgModule({
  declarations: [
    FlightListComponent,
    FlightsHomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule
  ]
})
export class FlightsModule {}
