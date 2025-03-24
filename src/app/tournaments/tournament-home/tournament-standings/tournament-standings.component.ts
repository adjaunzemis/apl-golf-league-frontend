import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';

import { TournamentStandings, TournamentStandingsTeam } from 'src/app/shared/tournament.model';

@Component({
  selector: 'app-tournament-standings',
  templateUrl: './tournament-standings.component.html',
  styleUrls: ['./tournament-standings.component.css'],
  imports: [CommonModule, CardModule, TableModule, TabsModule],
})
export class TournamentStandingsComponent {
  @Input() standings: TournamentStandings;
  @Output() teamSelected = new EventEmitter<number>();

  selectedTeam: TournamentStandingsTeam;

  onTeamSelected() {
    this.teamSelected.emit(this.selectedTeam.team_id);
  }
}
