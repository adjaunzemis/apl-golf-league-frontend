import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TeamData } from 'src/app/shared/team.model';
import { Golfer } from 'src/app/shared/golfer.model';

@Component({
  selector: 'app-team-roster',
  templateUrl: './team-roster.component.html',
  styleUrl: './team-roster.component.css',
  imports: [CommonModule, RouterModule, CardModule, TableModule],
})
export class TeamRosterComponent {
  @Input() showTeamEmailButton = true;
  @Input() teamData!: TeamData;

  selectedGolfer: Golfer | undefined;

  onGolferSelected(): void {
    console.log('Selected');
  }

  getTeamEmailList(): string | null {
    return 'emails!';
  }
}
