import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';

import { FlightTeam, FlightTeamGolfer } from 'src/app/shared/flight.model';

@Component({
  selector: 'app-flight-teams',
  templateUrl: './flight-teams.component.html',
  styleUrl: './flight-teams.component.css',
  imports: [CommonModule, CardModule, AccordionModule, TableModule],
})
export class FlightTeamsComponent {
  @Input() teams: FlightTeam[];
  @Input() linkGolferHome = true;

  selectedGolfer: FlightTeamGolfer;

  private router = inject(Router);

  onGolferSelected(): void {
    if (this.linkGolferHome && this.selectedGolfer.golfer_id) {
      this.router.navigate(['/golfer'], {
        queryParams: { id: this.selectedGolfer.golfer_id },
      });
    }
  }
}
