import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { FlightInfoComponent } from './flight-info/flight-info.component';
import { FlightStandingsComponent } from './flight-standings/flight-standings.component';
import { FlightTeamsComponent } from './flight-teams/flight-teams.component';
import { FlightScheduleMatrixComponent } from './flight-schedule-matrix/flight-schedule-matrix.component';

@Component({
  selector: 'app-flight-homepage',
  templateUrl: './flight-homepage.component.html',
  styleUrl: './flight-homepage.component.css',
  imports: [
    CommonModule,
    ProgressSpinnerModule,
    FlightInfoComponent,
    FlightStandingsComponent,
    FlightTeamsComponent,
    FlightScheduleMatrixComponent,
  ],
})
export class FlightHomepageComponent implements OnInit {
  flightId: number;

  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params) {
        if (params.id) {
          console.log(
            '[FlightHomeComponent] Processing route with query parameter: id=' + params.id,
          );
          this.flightId = params.id;
        }
      }
    });
  }
}
