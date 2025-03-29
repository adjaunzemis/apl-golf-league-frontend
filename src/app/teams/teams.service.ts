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
    if (teamData.flight_id) {
      return this.http.post<{ id: number; name: string }>(environment.apiUrl + `teams/`, {
        name: teamData.name,
        flight_id: teamData.flight_id,
        golfer_data: teamData.golfers,
      });
    } else {
      return this.http.post<{ id: number; name: string }>(environment.apiUrl + `teams/`, {
        name: teamData.name,
        tournament_id: teamData.tournament_id,
        golfer_data: teamData.golfers,
      });
    }
  }

  updateTeam(teamData: TeamCreate): Observable<{ id: number; name: string }> {
    if (teamData.flight_id) {
      return this.http.put<{ id: number; name: string }>(
        environment.apiUrl + `teams/${teamData.id}`,
        { name: teamData.name, flight_id: teamData.flight_id, golfer_data: teamData.golfers },
      );
    } else {
      return this.http.put<{ id: number; name: string }>(
        environment.apiUrl + `teams/${teamData.id}`,
        {
          name: teamData.name,
          tournament_id: teamData.tournament_id,
          golfer_data: teamData.golfers,
        },
      );
    }
  }
}
