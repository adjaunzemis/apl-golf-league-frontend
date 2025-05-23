import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import { environment } from './../../environments/environment';
import { TeamCreate, FlightTeamDataWithMatches } from '../shared/team.model';
import { Substitute } from '../shared/substitute.model';
import { FlightFreeAgent, TournamentFreeAgent } from '../shared/free-agent.model';

@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  private teamData: FlightTeamDataWithMatches;
  private teamDataUpdated = new Subject<FlightTeamDataWithMatches>();

  private http = inject(HttpClient);
  private router = inject(Router);

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

  deleteTeam(teamId: number): Observable<{ id: number; name: string }> {
    return this.http.delete<{ id: number; name: string }>(environment.apiUrl + `teams/${teamId}`);
  }

  addSubstitute(substitute: Substitute): Observable<Substitute> {
    return this.http.post<Substitute>(environment.apiUrl + `substitutes/`, substitute);
  }

  deleteSubstitute(substitute: Substitute): Observable<Substitute> {
    return this.http.delete<Substitute>(
      environment.apiUrl +
        `substitutes/?flight_id=${substitute.flight_id}&golfer_id=${substitute.golfer_id}`,
    );
  }

  addFlightFreeAgent(freeAgent: FlightFreeAgent): Observable<FlightFreeAgent> {
    return this.http.post<FlightFreeAgent>(environment.apiUrl + `free-agents/flight/`, freeAgent);
  }

  deleteFlightFreeAgent(freeAgent: FlightFreeAgent): Observable<FlightFreeAgent> {
    return this.http.delete<FlightFreeAgent>(
      environment.apiUrl +
        `free-agents/flight/?flight_id=${freeAgent.flight_id}&golfer_id=${freeAgent.golfer_id}`,
    );
  }

  getFlightTeamData(id: number): void {
    this.http
      .get<FlightTeamDataWithMatches>(environment.apiUrl + `teams/${id}`)
      .subscribe((result) => {
        this.teamData = result;
        this.teamDataUpdated.next(result);
      });
  }

  getFlightTeamDataUpdateListener(): Observable<FlightTeamDataWithMatches> {
    return this.teamDataUpdated.asObservable();
  }

  addTournamentFreeAgent(freeAgent: TournamentFreeAgent): Observable<TournamentFreeAgent> {
    return this.http.post<TournamentFreeAgent>(
      environment.apiUrl + `free-agents/tournament/`,
      freeAgent,
    );
  }

  deleteTournamentFreeAgent(freeAgent: TournamentFreeAgent): Observable<TournamentFreeAgent> {
    return this.http.delete<TournamentFreeAgent>(
      environment.apiUrl +
        `free-agents/tournament/?tournament_id=${freeAgent.tournament_id}&golfer_id=${freeAgent.golfer_id}`,
    );
  }
}
