import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { FlightsService } from '../flights.service';
import { FlightInfo } from '../../shared/flight.model';

@Component({
  selector: 'app-flight-history',
  templateUrl: './flight-history.component.html',
  styleUrls: ['./flight-history.component.css'],
  standalone: false,
})
export class FlightHistoryComponent implements OnInit, OnDestroy {
  isLoading = true;
  flights: FlightInfo[] = [];
  private flightsSub: Subscription;

  flightsSortedByYear: { [year: number]: FlightInfo[] };
  sortedYears: number[];

  constructor(private flightsService: FlightsService) {}

  ngOnInit(): void {
    this.flightsSub = this.flightsService.getFlightsListUpdateListener().subscribe((result) => {
      console.log(`[LeagueHomeComponent] Received flights list`);
      this.flights = result.flights;
      this.sortFlightsByYear();
      this.isLoading = false;
    });

    this.flightsService.getFlightsList();
  }

  ngOnDestroy(): void {
    this.flightsSub.unsubscribe();
  }

  private sortFlightsByYear(): void {
    this.sortedYears = [];
    this.flightsSortedByYear = {};
    for (let flight of this.flights) {
      if (!this.flightsSortedByYear[flight.year]) {
        this.sortedYears.push(flight.year);
        this.flightsSortedByYear[flight.year] = [];
      }
      this.flightsSortedByYear[flight.year].push(flight);
    }

    this.sortedYears.sort((a, b) => b - a);
  }

  getFlightsForYear(year: number): FlightInfo[] {
    return this.flightsSortedByYear[year];
  }
}
