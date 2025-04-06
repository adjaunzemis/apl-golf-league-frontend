import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';

import { FlightStandings, FlightStandingsTeam } from 'src/app/shared/flight.model';

@Component({
  selector: 'app-flight-standings',
  templateUrl: './flight-standings.component.html',
  styleUrls: ['./flight-standings.component.css'],
  imports: [CommonModule, CardModule, TableModule],
})
export class FlightStandingsComponent {
  @Input() standings: FlightStandings;

  selectedTeam: FlightStandingsTeam;

  private router = inject(Router);

  onTeamSelected(): void {
    if (this.selectedTeam.team_id) {
      this.router.navigate(['/flight-team'], {
        queryParams: { id: this.selectedTeam.team_id },
      });
    }
  }
}
