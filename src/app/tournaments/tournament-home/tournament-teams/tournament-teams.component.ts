import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';

import { TournamentTeam, TournamentTeamGolfer } from 'src/app/shared/tournament.model';

@Component({
  selector: 'app-tournament-teams',
  templateUrl: './tournament-teams.component.html',
  styleUrl: './tournament-teams.component.css',
  imports: [CommonModule, CardModule, AccordionModule, TableModule],
})
export class TournamentTeamsComponent {
  @Input() teams: TournamentTeam[];

  selectedGolfer: TournamentTeamGolfer;

  private router = inject(Router);

  onGolferSelected(): void {
    if (this.selectedGolfer.golfer_id) {
      this.router.navigate(['/golfer'], {
        queryParams: { id: this.selectedGolfer.golfer_id },
      });
    }
  }
}
