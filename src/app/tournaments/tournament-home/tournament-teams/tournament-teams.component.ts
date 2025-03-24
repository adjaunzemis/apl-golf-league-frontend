import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';

import { TournamentTeam } from 'src/app/shared/tournament.model';

@Component({
  selector: 'app-tournament-teams',
  templateUrl: './tournament-teams.component.html',
  styleUrl: './tournament-teams.component.css',
  imports: [CommonModule, CardModule, AccordionModule, TableModule],
})
export class TournamentTeamsComponent {
  @Input() teams: TournamentTeam[];
}
