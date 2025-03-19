import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import {
  FlightData,
  FlightInfo,
  FlightDivision,
  FlightCreate,
  FlightStandings,
  FlightTeam,
} from '../shared/flight.model';
import { TeamDataWithMatches } from '../shared/team.model';
import { environment } from './../../environments/environment';
import { MatchSummary } from '../shared/match.model';

@Injectable({
  providedIn: 'root',
})
export class FlightsService {
  private flightsList: FlightInfo[] = [];
  private flightsListUpdated = new Subject<FlightInfo[]>();

  private flightInfo: FlightInfo;
  private flightInfoUpdated = new Subject<FlightInfo>();

  private flightDivisions: FlightDivision[];
  private flightDivisionsUpdated = new Subject<FlightDivision[]>();

  private flightTeams: FlightTeam[];
  private flightTeamsUpdated = new Subject<FlightTeam[]>();

  private flightStandings: FlightStandings;
  private flightStandingsUpdated = new Subject<FlightStandings>();

  private flightMatches: MatchSummary[];
  private flightMatchesUpdated = new Subject<MatchSummary[]>();

  private flightData: FlightData;
  private flightDataUpdated = new Subject<FlightData>();

  private teamData: TeamDataWithMatches;
  private teamDataUpdated = new Subject<TeamDataWithMatches>();

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
      .get<FlightInfo[]>(environment.apiUrl + 'flights/' + queryParams)
      .subscribe((result) => {
        this.flightsList = result;
        this.flightsListUpdated.next([...this.flightsList]);
      });
  }

  getListUpdateListener(): Observable<FlightInfo[]> {
    return this.flightsListUpdated.asObservable();
  }

  getData(id: number): void {
    this.http.get<FlightData>(environment.apiUrl + `flights/${id}`).subscribe((result) => {
      this.flightData = result;
      if (this.flightData.signup_start_date) {
        this.flightData.signup_start_date = new Date(this.flightData.signup_start_date);
      }
      if (this.flightData.signup_stop_date) {
        this.flightData.signup_stop_date = new Date(this.flightData.signup_stop_date);
      }
      if (this.flightData.start_date) {
        this.flightData.start_date = new Date(this.flightData.start_date);
      }
      this.flightDataUpdated.next(this.flightData);
    });
  }

  getDataUpdateListener(): Observable<FlightData> {
    return this.flightDataUpdated.asObservable();
  }

  createFlight(flight: FlightCreate): Observable<FlightInfo> {
    return this.http.post<FlightInfo>(environment.apiUrl + `flights`, flight);
  }

  updateFlight(flight: FlightCreate): Observable<FlightInfo> {
    return this.http.put<FlightInfo>(environment.apiUrl + `flights/${flight.id}`, flight);
  }

  getInfo(id: number): void {
    this.http.get<FlightInfo>(environment.apiUrl + `flights/info/${id}`).subscribe((result) => {
      this.flightInfo = result;
      this.flightInfoUpdated.next(result);
    });
  }

  getInfoUpdateListener(): Observable<FlightInfo> {
    return this.flightInfoUpdated.asObservable();
  }

  getDivisions(id: number): void {
    this.http
      .get<FlightDivision[]>(environment.apiUrl + `flights/divisions/${id}`)
      .subscribe((result) => {
        this.flightDivisions = result;
        this.flightDivisionsUpdated.next([...this.flightDivisions]);
      });
  }

  getDivisionsUpdateListener(): Observable<FlightDivision[]> {
    return this.flightDivisionsUpdated.asObservable();
  }

  getTeams(id: number): void {
    this.http.get<FlightTeam[]>(environment.apiUrl + `flights/teams/${id}`).subscribe((result) => {
      this.flightTeams = result;
      this.flightTeamsUpdated.next(result);
    });
  }

  getTeamsUpdateListener(): Observable<FlightTeam[]> {
    return this.flightTeamsUpdated.asObservable();
  }

  getStandings(id: number): void {
    this.http
      .get<FlightStandings>(environment.apiUrl + `flights/standings/${id}`)
      .subscribe((result) => {
        this.flightStandings = result;
        this.flightStandingsUpdated.next(result);
      });
  }

  getStandingsUpdateListener(): Observable<FlightStandings> {
    return this.flightStandingsUpdated.asObservable();
  }

  getMatches(id: number): void {
    this.http
      .get<MatchSummary[]>(environment.apiUrl + `flights/matches/${id}`)
      .subscribe((result) => {
        this.flightMatches = result;
        this.flightMatchesUpdated.next(result);
      });
  }

  getMatchesUpdateListener(): Observable<MatchSummary[]> {
    return this.flightMatchesUpdated.asObservable();
  }

  // TODO: Move team routes to own service
  getTeamData(id: number): void {
    this.http.get<TeamDataWithMatches>(environment.apiUrl + `teams/${id}`).subscribe((result) => {
      this.teamData = result;
      this.teamDataUpdated.next(result);
    });
  }

  getTeamDataUpdateListener(): Observable<TeamDataWithMatches> {
    return this.teamDataUpdated.asObservable();
  }
}
