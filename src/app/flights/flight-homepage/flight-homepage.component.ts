import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { FlightsService } from '../flights.service';
import { FlightData } from 'src/app/shared/flight.model';
import { FlightInfoComponent } from './flight-info/flight-info.component';
import { FlightStandingsComponent } from './flight-standings/flight-standings.component';

@Component({
  selector: 'app-flight-homepage',
  templateUrl: './flight-homepage.component.html',
  styleUrl: './flight-homepage.component.css',
  imports: [CommonModule, ProgressSpinnerModule, FlightInfoComponent, FlightStandingsComponent],
})
export class FlightHomepageComponent implements OnInit {
  flight!: FlightData;

  private route = inject(ActivatedRoute);
  private flightsService = inject(FlightsService);

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params) {
        if (params.id) {
          console.log(
            '[FlightHomeComponent] Processing route with query parameter: id=' + params.id,
          );
          this.flightsService.getFlight(params.id);
        }
      }
    });

    this.flightsService.getFlightUpdateListener().subscribe((result) => {
      this.flight = result;
    });
  }
}
