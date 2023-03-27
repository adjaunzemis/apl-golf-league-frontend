import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { TournamentInput } from "../shared/match.model";
import { RoundSummary } from "../shared/round.model";

import { TournamentData, TournamentInfo } from "../shared/tournament.model";
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: "root"
})
export class TournamentsService {
  private tournamentsList: TournamentInfo[] = []
  private tournamentsListUpdated = new Subject<{ numTournaments: number, tournaments: TournamentInfo[] }>();

  private tournamentData: TournamentData;
  private tournamentDataUpdated = new Subject<TournamentData>();

  constructor(private http: HttpClient, private router: Router) {}

  getTournamentsList(year?: number): void {
    let queryParams: string = ``;
    if (year) {
      queryParams = `?year=${year}&`;
    }
    this.http.get<{ num_tournaments: number, tournaments: TournamentInfo[] }>(environment.apiUrl + "tournaments/" + queryParams)
      .subscribe(result => {
        this.tournamentsList = result.tournaments;
        this.tournamentsList.map(tournament => {
          if (tournament.date) {
            tournament.date = new Date(tournament.date);
          }
          if (tournament.signup_start_date) {
            tournament.signup_start_date = new Date(tournament.signup_start_date);
          }
          if (tournament.signup_stop_date) {
            tournament.signup_stop_date = new Date(tournament.signup_stop_date);
          }
        });
        this.tournamentsListUpdated.next({
          numTournaments: result.num_tournaments,
          tournaments: [...this.tournamentsList]
        });
      });
  }

  getTournamentsListUpdateListener(): Observable<{ tournaments: TournamentInfo[], numTournaments: number }> {
    return this.tournamentsListUpdated.asObservable();
  }

  getTournament(id: number): void {
    this.http.get<TournamentData>(environment.apiUrl + `tournaments/${id}`)
      .subscribe(result => {
        this.tournamentData = result;
        if (this.tournamentData.date) {
          this.tournamentData.date = new Date(this.tournamentData.date);
        }
        if (this.tournamentData.signup_start_date) {
          this.tournamentData.signup_start_date = new Date(this.tournamentData.signup_start_date);
        }
        if (this.tournamentData.signup_stop_date) {
          this.tournamentData.signup_stop_date = new Date(this.tournamentData.signup_stop_date);
        }
        this.tournamentDataUpdated.next(this.tournamentData);
      });
  }

  getTournamentUpdateListener(): Observable<TournamentData> {
    return this.tournamentDataUpdated.asObservable();
  }

  createTeam(name: string, tournament_id: number, golfer_data: { golfer_id: number, golfer_name: string, division_id: number, role: string }[]): Observable<{ id: number, name: string }> {
    return this.http.post<{ id: number, name: string }>(environment.apiUrl + `teams/`, { name: name, tournament_id: tournament_id, golfer_data: golfer_data });
  }
  
  updateTeam(team_id: number, name: string, tournament_id: number, golfer_data: { golfer_id: number, golfer_name: string, division_id: number, role: string }[]): Observable<{ id: number, name: string }> {
    return this.http.put<{ id: number, name: string }>(environment.apiUrl + `teams/${team_id}`, { name: name, tournament_id: tournament_id, golfer_data: golfer_data })
  }

  postRounds(tournamentInput: TournamentInput): Observable<RoundSummary[]> {
    return this.http.post<RoundSummary[]>(environment.apiUrl + `tournaments/rounds`, tournamentInput);
  }

}
