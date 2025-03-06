import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { FlightsService } from '../../flights.service';
import { FlightInfo } from 'src/app/shared/flight.model';

@Component({
  selector: 'app-flight-info',
  templateUrl: './flight-info.component.html',
  styleUrl: './flight-info.component.css',
  imports: [CommonModule, CardModule],
})
export class FlightInfoComponent implements OnInit {
  @Input() flightId: number;

  info: FlightInfo;
  private flightsService = inject(FlightsService);

  ngOnInit(): void {
    this.flightsService.getFlightInfoUpdateListener().subscribe((result) => {
      this.info = result;
    });

    this.flightsService.getFlightInfo(this.flightId);
  }
}
