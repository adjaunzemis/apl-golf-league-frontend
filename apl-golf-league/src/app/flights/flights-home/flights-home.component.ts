import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { TeamData } from 'src/app/shared/team.model';

import { FlightData } from '../../shared/flight.model';
import { FlightsService } from '../flights.service';

@Component({
  selector: 'app-flights-home',
  templateUrl: './flights-home.component.html',
  styleUrls: ['./flights-home.component.css']
})
export class FlightsHomeComponent implements OnInit, OnDestroy {
  isLoading = false;

  year: number;

  flights: FlightData[];
  flightsSub: Subscription;

  constructor(private flightsService: FlightsService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.isLoading = true;

    this.flightsSub = this.flightsService.getFlightUpdateListener()
      .subscribe((result: {flights: FlightData[], numFlights: number}) => {
        console.log(`[FlightHomeComponent] Fetching flight data`);
        this.isLoading = false;
        this.flights = result.flights;
      });

    this.route.queryParams.subscribe(params => {
      if (params) {
        if (params.year) {
          console.log("[FlightListComponent] Setting query parameter year=" + params.year);
          this.year = params.year;
        }
      }
    });

    this.getFlightData();
  }

  ngOnDestroy(): void {
    this.flightsSub.unsubscribe();
  }

  private getFlightData(): void {
    this.flightsService.getFlights(0, 100, this.year);
  }

  selectTeam(team: TeamData): void {
    // TODO: Navigate to team page
    console.log(team);
  }
}

interface FlightDataByYear {
  year: number;
  flights: FlightData[];
}
