import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';

import { TournamentDivision } from 'src/app/shared/tournament.model';

@Component({
  selector: 'app-tournament-divisions',
  templateUrl: './tournament-divisions.component.html',
  styleUrl: './tournament-divisions.component.css',
  imports: [CommonModule, CardModule, TableModule],
})
export class TournamentDivisionsComponent {
  @Input() divisions: TournamentDivision[];
}
