import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { FlightInfoComponent } from './flight-info/flight-info.component';
import { FlightStandingsComponent } from './flight-standings/flight-standings.component';
import { FlightTeamsComponent } from './flight-teams/flight-teams.component';
import { FlightScheduleComponent } from './flight-schedule/flight-schedule.component';
import { FlightsService } from '../flights.service';
import { FlightInfo, FlightStandings, FlightTeam } from 'src/app/shared/flight.model';
import { MatchSummary } from 'src/app/shared/match.model';

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
    FlightScheduleComponent,
  ],
})
export class FlightHomepageComponent implements OnInit {
  info: FlightInfo | undefined;
  teams: FlightTeam[] | undefined;
  standings: FlightStandings | undefined;
  matches: MatchSummary[] | undefined;

  private route = inject(ActivatedRoute);
  private flightsService = inject(FlightsService);

  ngOnInit(): void {
    this.flightsService.getInfoUpdateListener().subscribe((result) => (this.info = result));
    this.flightsService.getTeamsUpdateListener().subscribe((result) => (this.teams = result));
    this.flightsService
      .getStandingsUpdateListener()
      .subscribe((result) => (this.standings = result));
    this.flightsService.getMatchesUpdateListener().subscribe((result) => (this.matches = result));

    this.route.queryParams.subscribe((params) => {
      if (params && params.id) {
        console.log('[FlightHomeComponent] Processing route with query parameter: id=' + params.id);
        const flightId = params.id;

        this.flightsService.getInfo(flightId);
        this.flightsService.getTeams(flightId);
        this.flightsService.getStandings(flightId);
        this.flightsService.getMatches(flightId);
      }
    });
  }
}
