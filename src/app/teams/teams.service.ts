import { TeamGolferCreate } from './../shared/team.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { environment } from './../../environments/environment';
import { TeamCreate } from '../shared/team.model';

@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  createTeam(teamData: TeamCreate): Observable<{ id: number; name: string }> {
    const teamGolfersSignupData = this.extractTeamGolferSignupData(teamData.golfers);
    if (teamData.flight_id) {
      return this.http.post<{ id: number; name: string }>(environment.apiUrl + `teams/`, {
        name: teamData.name,
        flight_id: teamData.flight_id,
        golfer_data: teamGolfersSignupData,
      });
    } else {
      return this.http.post<{ id: number; name: string }>(environment.apiUrl + `teams/`, {
        name: teamData.name,
        tournament_id: teamData.tournament_id,
        golfer_data: teamGolfersSignupData,
      });
    }
  }

  updateTeam(teamData: TeamCreate): Observable<{ id: number; name: string }> {
    const teamGolfersSignupData = this.extractTeamGolferSignupData(teamData.golfers);
    if (teamData.flight_id) {
      return this.http.put<{ id: number; name: string }>(
        environment.apiUrl + `teams/${teamData.id}`,
        { name: teamData.name, flight_id: teamData.flight_id, golfer_data: teamGolfersSignupData },
      );
    } else {
      return this.http.put<{ id: number; name: string }>(
        environment.apiUrl + `teams/${teamData.id}`,
        {
          name: teamData.name,
          tournament_id: teamData.tournament_id,
          golfer_data: teamGolfersSignupData,
        },
      );
    }
  }

  private extractTeamGolferSignupData(
    teamGolfers: TeamGolferCreate[],
  ): { golfer_id: number; golfer_name: string; division_id: number; role: string }[] {
    const teamGolferSignupData: {
      golfer_id: number;
      golfer_name: string;
      division_id: number;
      role: string;
    }[] = [];
    for (const teamGolfer of teamGolfers) {
      teamGolferSignupData.push({
        golfer_id: teamGolfer.golfer.id,
        golfer_name: teamGolfer.golfer.name,
        division_id: teamGolfer.division.id,
        role: teamGolfer.role,
      });
    }
    return teamGolferSignupData;
  }
}
