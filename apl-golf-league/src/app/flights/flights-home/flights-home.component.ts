import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { FlightData } from '../../shared/flight.model';
import { FlightsService } from '../flights.service';
import { TeamData } from '../../shared/team.model';

/**
 * @deprecated Replaced with individual FlightHomeComponents
 */
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

  constructor(private flightsService: FlightsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.isLoading = true;

    this.flightsSub = this.flightsService.getFlightsListUpdateListener()
      .subscribe((result: {flights: FlightData[], numFlights: number}) => {
        console.log(`[FlightsHomeComponent] Fetching flight data`);
        this.isLoading = false;
        this.flights = result.flights;
      });

    this.route.queryParams.subscribe(params => {
      if (params) {
        if (params.year) {
          console.log("[FlightsHomeComponent] Setting query parameter year=" + params.year);
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
    this.flightsService.getFlightsList(0, 100, this.year);
  }

  selectTeam(team: TeamData): void {
    this.router.navigate(['/flights/team'], { queryParams: { id: team.id } });
  }
}
