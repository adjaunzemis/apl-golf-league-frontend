import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AngularMaterialModule } from "../angular-material.module";
import { TournamentHomeComponent } from './tournament-home/tournament-home.component';
import { TournamentStandingsComponent } from './tournament-standings/tournament-standings.component';


@NgModule({
  declarations: [
    TournamentHomeComponent,
    TournamentStandingsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule
  ]
})
export class TournamentsModule {}
