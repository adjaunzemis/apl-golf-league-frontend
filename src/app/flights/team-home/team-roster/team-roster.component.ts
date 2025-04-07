import { Component, Input, OnInit } from '@angular/core';
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
export class TeamRosterComponent implements OnInit {
  @Input() showTeamEmailButton = true;
  @Input() teamData!: TeamData;

  selectedGolfer: Golfer | undefined;

  ngOnInit(): void {
    this.teamData.golfers.sort((a, b) => {
      if (a.role < b.role) {
        return -1;
      } else if (b.role < a.role) {
        return 1;
      }
      return 0;
    });
  }

  onGolferSelected(): void {
    console.log('Selected');
  }

  getTeamEmailList(): string | null {
    let emailList = '';
    for (const golfer of this.teamData.golfers) {
      if (golfer.golfer_email) {
        emailList += golfer.golfer_email + ';';
      }
    }
    return emailList.substring(0, emailList.length - 1);
  }
}
