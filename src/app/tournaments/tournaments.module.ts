import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TournamentStandingsComponent } from './tournament-standings/tournament-standings.component';
import { ScorecardModule } from '../shared/scorecard/scorecard.module';
import { DivisionsModule } from '../divisions/divisions.module';

@NgModule({
  declarations: [TournamentStandingsComponent],
  imports: [CommonModule, RouterModule, ScorecardModule, DivisionsModule],
})
export class TournamentsModule {}
