import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';

import {
  TournamentGolferHandicapData,
  TournamentTeamHandicapData,
} from 'src/app/shared/tournament.model';

@Component({
  selector: 'app-tournament-handicaps',
  templateUrl: './tournament-handicaps.component.html',
  styleUrls: ['./tournament-handicaps.component.css'],
  imports: [CommonModule, CardModule, TableModule, TabsModule],
})
export class TournamentHandicapsComponent {
  @Input() handicaps: [TournamentGolferHandicapData[], TournamentTeamHandicapData[]];

  get golferHandicaps(): TournamentGolferHandicapData[] {
    return this.handicaps?.[0] ?? [];
  }

  get teamHandicaps(): TournamentTeamHandicapData[] {
    return this.handicaps?.[1] ?? [];
  }
}
