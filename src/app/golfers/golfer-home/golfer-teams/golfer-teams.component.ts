import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';

import { TeamGolferData } from 'src/app/shared/golfer.model';
import { TournamentInfo } from 'src/app/shared/tournament.model';
import { FlightInfo } from 'src/app/shared/flight.model';

@Component({
  selector: 'app-golfer-teams',
  templateUrl: './golfer-teams.component.html',
  styleUrl: './golfer-teams.component.css',
  imports: [CommonModule, FormsModule, RouterModule, CardModule, DataViewModule],
})
export class GolferTeamsComponent implements OnInit {
  @Input() teams: TeamGolferData[];
  @Input() flightInfo: FlightInfo[];
  @Input() tournamentInfo: TournamentInfo[];

  flightTeams: TeamGolferData[];
  tournamentTeams: TeamGolferData[];

  ngOnInit(): void {
    this.flightTeams = this.teams.filter((team) => team.flight_name);
    this.tournamentTeams = this.teams.filter((team) => team.tournament_name);
  }

  getLogoUrl(team: TeamGolferData): string {
    if (team.flight_id) {
      const flightInfo = this.flightInfo.find((info) => info.id === team.flight_id);
      if (flightInfo && flightInfo.logo_url) {
        return flightInfo.logo_url;
      }
    }
    if (team.tournament_id) {
      const tournamentInfo = this.tournamentInfo.find((info) => info.id === team.tournament_id);
      if (tournamentInfo && tournamentInfo.logo_url) {
        return tournamentInfo.logo_url;
      }
    }
    return '';
  }

  getLinkRoute(team: TeamGolferData): string {
    if (team.tournament_id) {
      return '/tournament';
    }
    return '/flight-team';
  }

  getLinkId(team: TeamGolferData): number {
    if (team.tournament_id) {
      return team.tournament_id;
    }
    return team.team_id;
  }

  getSubtitle(team: TeamGolferData): string {
    if (team.tournament_id) {
      return `${team.tournament_name} (${team.year})`;
    }
    return `${team.flight_name} (${team.year})`;
  }
}
