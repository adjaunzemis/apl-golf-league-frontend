import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { FlightData } from '../../shared/flight.model';
import { FlightsService } from '../flights.service';

@Component({
  selector: 'app-flight-home',
  templateUrl: './flight-home.component.html',
  styleUrls: ['./flight-home.component.css']
})
export class FlightHomeComponent implements OnInit, OnDestroy {
  isLoading = true;

  flight: FlightData;
  private flightSub: Subscription;

  constructor(private flightsService: FlightsService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.flightSub = this.flightsService.getFlightUpdateListener()
      .subscribe(flightData => {
          console.log(`[FlightHomeComponent] Received data for flight: name=${flightData.name}, year=${flightData.year}, id=" + ${flightData.flight_id}`);
          this.flight = flightData;
          this.isLoading = false;
          console.log(flightData);
      });

    this.route.queryParams.subscribe(params => {
      if (params) {
          if (params.id) {
              console.log("[FlightHomeComponent] Processing route with query parameter: id=" + params.id);
              this.flightsService.getFlight(params.id);
          }
      }
    });
  }

  ngOnDestroy(): void {
      this.flightSub.unsubscribe();
  }

}
