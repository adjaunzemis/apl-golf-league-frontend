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

  getFlightsList(offset: number, limit: number, year?: number): void {
    let queryParams: string = `?`;
    if (year) {
      queryParams = `?year=${year}&`;
    }
    queryParams += `offset=${offset}&limit=${limit}`
    this.http.get<{ num_flights: number, flights: FlightInfo[] }>(environment.apiUrl + "flights/" + queryParams)
      .subscribe(result => {
        this.flightsList = result.flights;
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
        this.flightDataUpdated.next(result);
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

}

