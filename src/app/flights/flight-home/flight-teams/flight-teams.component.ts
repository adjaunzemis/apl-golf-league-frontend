import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { AccordionModule, AccordionTabOpenEvent } from 'primeng/accordion';
import { TableModule } from 'primeng/table';

import { FlightTeam, FlightGolfer } from 'src/app/shared/flight.model';

@Component({
  selector: 'app-flight-teams',
  templateUrl: './flight-teams.component.html',
  styleUrl: './flight-teams.component.css',
  imports: [CommonModule, CardModule, AccordionModule, TableModule],
})
export class FlightTeamsComponent {
  @Input() teams: FlightTeam[];
  @Input() substitutes: FlightGolfer[] = [];
  @Input() linkGolferHome = true;
  @Input() teamMultiSelect = true;

  @Output() teamSelected = new EventEmitter<FlightTeam | null>();

  selectedGolfer: FlightGolfer;

  private router = inject(Router);

  onGolferSelected(): void {
    if (this.linkGolferHome && this.selectedGolfer.golfer_id) {
      this.router.navigate(['/golfer'], {
        queryParams: { id: this.selectedGolfer.golfer_id },
      });
    }
  }

  onTeamSelected(event: AccordionTabOpenEvent): void {
    this.teamSelected.emit(this.teams[event.index]);
  }

  onTeamDeselected(): void {
    this.teamSelected.emit(null);
  }
}
