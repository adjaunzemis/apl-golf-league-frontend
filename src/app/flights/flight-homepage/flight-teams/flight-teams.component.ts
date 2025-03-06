import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';

import { FlightsService } from '../../flights.service';
import { FlightTeam } from 'src/app/shared/flight.model';

@Component({
  selector: 'app-flight-teams',
  templateUrl: './flight-teams.component.html',
  styleUrl: './flight-teams.component.css',
  imports: [CommonModule, CardModule, AccordionModule],
})
export class FlightTeamsComponent implements OnInit {
  @Input() flightId: number;

  teams: FlightTeam[];
  private flightsService = inject(FlightsService);

  ngOnInit(): void {
    this.flightsService.getFlightTeamsUpdateListener().subscribe((result) => {
      this.teams = result;
    });

    this.flightsService.getFlightTeams(this.flightId);
  }
}
