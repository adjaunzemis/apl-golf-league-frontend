import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';

import { FlightInfo } from 'src/app/shared/flight.model';
import { TeamData } from 'src/app/shared/team.model';

@Component({
  selector: 'app-team-info',
  templateUrl: './team-info.component.html',
  styleUrl: './team-info.component.css',
  imports: [CommonModule, RouterModule, CardModule],
})
export class TeamInfoComponent {
  @Input() flightInfo!: FlightInfo;
  @Input() teamData!: TeamData;

  getCaptainName(): string | undefined {
    const captain = this.teamData.golfers.filter((golfer) => golfer.role === 'Captain')[0];
    return captain.golfer_name;
  }

  getCaptainEmail(): string | undefined {
    const captain = this.teamData.golfers.filter((golfer) => golfer.role === 'Captain')[0];
    return captain.golfer_email;
  }
}
