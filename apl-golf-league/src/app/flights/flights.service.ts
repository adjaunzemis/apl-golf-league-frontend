import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";

import { FlightData, FlightInfo } from "../shared/flight.model";
import { TeamData, TeamDataWithMatches } from "../shared/team.model";
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: "root"
})
export class FlightsService {
  private flightsList: FlightInfo[] = []
  private flightsListUpdated = new Subject<{ numFlights: number, flights: FlightInfo[] }>();

  private flightData: FlightData;
  private flightDataUpdated = new Subject<FlightData>();

  private teamData: TeamDataWithMatches;
  private teamDataUpdated = new Subject<TeamDataWithMatches>();

  constructor(private http: HttpClient, private router: Router) {}

  getFlightsList(year?: number): void {
    let queryParams: string = ``;
    if (year) {
      queryParams = `?year=${year}&`;
    }
    this.http.get<{ num_flights: number, flights: FlightInfo[] }>(environment.apiUrl + "flights/" + queryParams)
      .subscribe(result => {
        this.flightsList = result.flights;
        this.flightsList.map(flight => {
          if (flight.signup_start_date) {
            flight.signup_start_date = new Date(flight.signup_start_date);
          }
          if (flight.signup_stop_date) {
            flight.signup_stop_date = new Date(flight.signup_stop_date);
          }
          if (flight.start_date) {
            flight.start_date = new Date(flight.start_date);
          }
        });
        this.flightsListUpdated.next({
          numFlights: result.num_flights,
          flights: [...this.flightsList]
        });
      });
  }

  getFlightsListUpdateListener(): Observable<{ flights: FlightInfo[], numFlights: number }> {
    return this.flightsListUpdated.asObservable();
  }

  getFlight(id: number): void {
    this.http.get<FlightData>(environment.apiUrl + `flights/${id}`)
      .subscribe(result => {
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

  getFlightUpdateListener(): Observable<FlightData> {
    return this.flightDataUpdated.asObservable();
  }

  // TODO: Move team routes to own service
  getTeam(id: number): void {
    this.http.get<TeamDataWithMatches>(environment.apiUrl + `teams/${id}`)
      .subscribe(result => {
        this.teamData = result;
        this.teamDataUpdated.next(result);
      });
  }

  getTeamUpdateListener(): Observable<TeamDataWithMatches> {
    return this.teamDataUpdated.asObservable();
  }

  createTeam(name: string): Observable<{ id: number, name: string }> {
    return this.http.post<{ id: number, name: string }>(environment.apiUrl + `teams/`, { name: name });
  }

  createFlightTeamLink(flightId: number, teamId: number): Observable<{ flight_id: number, team_id: number }> {
    return this.http.post<{ flight_id: number, team_id: number }>(environment.apiUrl + `flights/${flightId}/team-links/${teamId}`, null);
  }

  createTeamGolferLink(teamId: number, golferId: number, role: string, divisionId: number): Observable<{ team_id: number, golfer_id: number, division_id: number, role: string }> {
    return this.http.post<{ team_id: number, golfer_id: number, division_id: number, role: string }>(environment.apiUrl + `teams/${teamId}/golfer-links/${golferId}?division_id=${divisionId}&role=${role}`, null);
  }

}

