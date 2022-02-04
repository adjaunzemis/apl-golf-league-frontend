import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AngularMaterialModule } from "../angular-material.module";
import { TournamentHomeComponent } from './tournament-home/tournament-home.component';
import { TournamentStandingsComponent } from './tournament-standings/tournament-standings.component';
import { TournamentScorecardComponent } from './tournament-scorecard/tournament-scorecard.component';
import { ScorecardModule } from "../shared/scorecard/scorecard.module";


@NgModule({
  declarations: [
    TournamentHomeComponent,
    TournamentStandingsComponent,
    TournamentScorecardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule,
    ScorecardModule
  ]
})
export class TournamentsModule {}
