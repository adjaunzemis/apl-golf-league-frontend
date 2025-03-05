import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';

import { FlightStandings } from 'src/app/shared/flight.model';
import { FlightsService } from '../../flights.service';

@Component({
  selector: 'app-flight-standings',
  templateUrl: './flight-standings.component.html',
  styleUrls: ['./flight-standings.component.css'],
  imports: [CommonModule, CardModule, TableModule],
})
export class FlightStandingsComponent implements OnInit {
  @Input() flightId: number;

  standings: FlightStandings;
  private flightsService = inject(FlightsService);

  ngOnInit(): void {
    this.flightsService.getFlightStandingsUpdateListener().subscribe((result) => {
      this.standings = result;
    });

    this.flightsService.getFlightStandings(this.flightId);
  }
}
