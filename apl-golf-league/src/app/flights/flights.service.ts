import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";

import { FlightData } from "../shared/flight.model";
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: "root"
})
export class FlightsService {
  private flightsData: FlightData[] = []
  private flightsDataUpdated = new Subject<{ numFlights: number, flights: FlightData[] }>();

  constructor(private http: HttpClient, private router: Router) {}

  getFlights(offset: number, limit: number, year?: number): void {
    let queryParams: string = `?`;
    if (year) {
      queryParams = `?year=${year}&`;
    }
    queryParams += `offset=${offset}&limit=${limit}`
    this.http.get<{ num_flights: number, flights: FlightData[] }>(environment.apiUrl + "flights/" + queryParams)
      .subscribe(result => {
        this.flightsData = result.flights;
        this.flightsDataUpdated.next({
          numFlights: result.num_flights,
          flights: [...this.flightsData]
        });
      });
  }

  getFlightUpdateListener(): Observable<{ flights: FlightData[], numFlights: number }> {
    return this.flightsDataUpdated.asObservable();
  }

}

