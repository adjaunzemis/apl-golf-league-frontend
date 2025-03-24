import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { TournamentInput } from '../shared/match.model';
import { RoundSummary } from '../shared/round.model';

import {
  TournamentCreate,
  TournamentData,
  TournamentDivision,
  TournamentInfo,
  TournamentTeam,
} from '../shared/tournament.model';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TournamentsService {
  private tournamentsList: TournamentInfo[] = [];
  private tournamentsListUpdated = new Subject<TournamentInfo[]>();

  private tournamentInfo: TournamentInfo;
  private tournamentInfoUpdated = new Subject<TournamentInfo>();

  private tournamentDivisions: TournamentDivision[];
  private tournamentDivisionsUpdated = new Subject<TournamentDivision[]>();

  private tournamentTeams: TournamentTeam[];
  private tournamentTeamsUpdated = new Subject<TournamentTeam[]>();

  // private tournamentStandings: TournamentStandings;
  // private tournamentStandingsUpdated = new Subject<TournamentStandings>();

  // private tournamentStatistics: TournamentStatistics;
  // private tournamentStatisticsUpdated = new Subject<TournamentStatistics>();

  // private tournamentMatches: MatchSummary[];
  // private tournamentMatchesUpdated = new Subject<MatchSummary[]>();

  private tournamentData: TournamentData;
  private tournamentDataUpdated = new Subject<TournamentData>();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  getList(year?: number): void {
    let queryParams = ``;
    if (year) {
      queryParams = `?year=${year}&`;
    }
    this.http
      .get<TournamentInfo[]>(environment.apiUrl + 'tournaments/' + queryParams)
      .subscribe((result) => {
        this.tournamentsList = [...result];
        this.tournamentsList.map((tournament) => {
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
        this.tournamentsListUpdated.next([...this.tournamentsList]);
      });
  }

  getListUpdateListener(): Observable<TournamentInfo[]> {
    return this.tournamentsListUpdated.asObservable();
  }

  getTournament(id: number): void {
    this.http.get<TournamentData>(environment.apiUrl + `tournaments/${id}`).subscribe((result) => {
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

  createTournament(tournament: TournamentCreate): Observable<TournamentInfo> {
    return this.http.post<TournamentInfo>(environment.apiUrl + `tournaments`, tournament);
  }

  updateTournament(tournament: TournamentCreate): Observable<TournamentInfo> {
    return this.http.put<TournamentInfo>(
      environment.apiUrl + `tournaments/${tournament.id}`,
      tournament,
    );
  }

  postRounds(tournamentInput: TournamentInput): Observable<RoundSummary[]> {
    return this.http.post<RoundSummary[]>(
      environment.apiUrl + `tournaments/rounds`,
      tournamentInput,
    );
  }

  getInfo(id: number): void {
    this.http
      .get<TournamentInfo>(environment.apiUrl + `tournaments/info/${id}`)
      .subscribe((result) => {
        this.tournamentInfo = result;
        this.tournamentInfoUpdated.next(result);
      });
  }

  getInfoUpdateListener(): Observable<TournamentInfo> {
    return this.tournamentInfoUpdated.asObservable();
  }

  getDivisions(id: number): void {
    this.http
      .get<TournamentDivision[]>(environment.apiUrl + `tournaments/divisions/${id}`)
      .subscribe((result) => {
        this.tournamentDivisions = result;
        this.tournamentDivisionsUpdated.next([...this.tournamentDivisions]);
      });
  }

  getDivisionsUpdateListener(): Observable<TournamentDivision[]> {
    return this.tournamentDivisionsUpdated.asObservable();
  }

  getTeams(id: number): void {
    this.http
      .get<TournamentTeam[]>(environment.apiUrl + `tournaments/teams/${id}`)
      .subscribe((result) => {
        this.tournamentTeams = result;
        this.tournamentTeamsUpdated.next(result);
      });
  }

  getTeamsUpdateListener(): Observable<TournamentTeam[]> {
    return this.tournamentTeamsUpdated.asObservable();
  }

  // getStandings(id: number): void {
  //   this.http
  //     .get<TournamentStandings>(environment.apiUrl + `tournaments/standings/${id}`)
  //     .subscribe((result) => {
  //       this.tournamentStandings = result;
  //       this.tournamentStandingsUpdated.next(result);
  //     });
  // }

  // getStandingsUpdateListener(): Observable<TournamentStandings> {
  //   return this.tournamentStandingsUpdated.asObservable();
  // }

  // getStatistics(id: number): void {
  //   this.http
  //     .get<TournamentStatistics>(environment.apiUrl + `tournaments/statistics/${id}`)
  //     .subscribe((result) => {
  //       this.tournamentStatistics = result;
  //       this.tournamentStatisticsUpdated.next(result);
  //     });
  // }

  // getStatisticsUpdateListener(): Observable<TournamentStatistics> {
  //   return this.tournamentStatisticsUpdated.asObservable();
  // }

  // getMatches(id: number): void {
  //   this.http
  //     .get<MatchSummary[]>(environment.apiUrl + `tournaments/matches/${id}`)
  //     .subscribe((result) => {
  //       this.tournamentMatches = result;
  //       this.tournamentMatchesUpdated.next(result);
  //     });
  // }

  // getMatchesUpdateListener(): Observable<MatchSummary[]> {
  //   return this.tournamentMatchesUpdated.asObservable();
  // }
}
