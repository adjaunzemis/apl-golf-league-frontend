import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";

import { TournamentData } from "../shared/tournament.model";
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: "root"
})
export class TournamentsService {
  private tournamentsList: TournamentData[] = []
  private tournamentsListUpdated = new Subject<{ numTournaments: number, tournaments: TournamentData[] }>();

  private tournamentData: TournamentData;
  private tournamentDataUpdated = new Subject<TournamentData>();

  constructor(private http: HttpClient, private router: Router) {}

  getTournamentsList(offset: number, limit: number, year?: number): void {
    let queryParams: string = `?`;
    if (year) {
      queryParams = `?year=${year}&`;
    }
    queryParams += `offset=${offset}&limit=${limit}`
    this.http.get<{ num_tournaments: number, tournaments: TournamentData[] }>(environment.apiUrl + "tournaments/" + queryParams)
      .subscribe(result => {
        this.tournamentsList = result.tournaments;
        this.tournamentsListUpdated.next({
          numTournaments: result.num_tournaments,
          tournaments: [...this.tournamentsList]
        });
      });
  }

  getTournamentsListUpdateListener(): Observable<{ tournaments: TournamentData[], numTournaments: number }> {
    return this.tournamentsListUpdated.asObservable();
  }

  getTournament(id: number): void {
    this.http.get<TournamentData>(environment.apiUrl + `tournaments/${id}`)
      .subscribe(result => {
        this.tournamentData = result;
        this.tournamentDataUpdated.next(result);
      });
  }

  getTournamentUpdateListener(): Observable<TournamentData> {
    return this.tournamentDataUpdated.asObservable();
  }
}
