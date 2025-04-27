import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { AccordionModule, AccordionTabOpenEvent } from 'primeng/accordion';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

import { FlightTeam, FlightGolfer } from 'src/app/shared/flight.model';

@Component({
  selector: 'app-flight-teams',
  templateUrl: './flight-teams.component.html',
  styleUrl: './flight-teams.component.css',
  imports: [CommonModule, CardModule, AccordionModule, TableModule, ButtonModule],
})
export class FlightTeamsComponent {
  @Input() teams: FlightTeam[];
  @Input() substitutes: FlightGolfer[] = [];
  @Input() linkTeamHome = true;
  @Input() linkGolferHome = true;
  @Input() teamMultiSelect = true;
  @Input() showFlightEmailButton = false;

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

  onTeamHomeSelected(team: FlightTeam): void {
    this.router.navigate(['/flight-team'], {
      queryParams: { id: team.team_id },
    });
  }

  getFlightEmailList(): string {
    // TODO: Deduplicate emails
    let emailList = '';
    for (const team of this.teams) {
      for (const golfer of team.golfers) {
        if (golfer.email) {
          emailList += golfer.email + ';';
        }
      }
    }
    return emailList.substring(0, emailList.length - 1);
  }

  getSubstitutesEmailList(): string {
    let emailList = '';
    for (const golfer of this.substitutes) {
      if (golfer.email) {
        emailList += golfer.email + ';';
      }
    }
    return emailList.substring(0, emailList.length - 1);
  }
}
