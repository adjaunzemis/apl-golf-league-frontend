import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../angular-material.module';
import { TournamentHomeComponent } from './tournament-home/tournament-home.component';
import { TournamentStandingsComponent } from './tournament-standings/tournament-standings.component';
import { TournamentScorecardComponent } from './tournament-scorecard/tournament-scorecard.component';
import { ScorecardModule } from '../shared/scorecard/scorecard.module';
import { TournamentHistoryComponent } from './tournament-history/tournament-history.component';
import { DivisionsModule } from '../divisions/divisions.module';
import { TournamentScorecardCreateComponent } from './tournament-scorecard-create/tournament-scorecard-create.component';
import { TournamentCreateComponent } from './tournament-create/tournament-create.component';

@NgModule({
  declarations: [
    TournamentHomeComponent,
    TournamentStandingsComponent,
    TournamentScorecardComponent,
    TournamentHistoryComponent,
    TournamentScorecardCreateComponent,
    TournamentCreateComponent,
  ],
  imports: [CommonModule, RouterModule, AngularMaterialModule, ScorecardModule, DivisionsModule],
})
export class TournamentsModule {}
