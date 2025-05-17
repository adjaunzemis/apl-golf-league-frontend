import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { AccordionModule, AccordionTabOpenEvent } from 'primeng/accordion';
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
  @Input() linkGolferHome = true;
  @Input() teamMultiSelect = true;
  @Input() showTournamentEmailButton = true;
  @Input() showTeamEmailButton = true;

  @Output() teamSelected = new EventEmitter<TournamentTeam | null>();

  selectedGolfer: TournamentTeamGolfer;

  private router = inject(Router);

  onGolferSelected(): void {
    if (this.selectedGolfer.golfer_id) {
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

  getTournamentEmailList(): string {
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

  getTeamEmailList(team: TournamentTeam): string {
    let emailList = '';
    for (const golfer of team.golfers) {
      if (golfer.email) {
        emailList += golfer.email + ';';
      }
    }
    return emailList.substring(0, emailList.length - 1);
  }
}
