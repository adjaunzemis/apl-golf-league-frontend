import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { FlightInfoComponent } from './flight-info/flight-info.component';
import { FlightDivisionsComponent } from './flight-divisions/flight-divisions.component';
import { FlightStandingsComponent } from './flight-standings/flight-standings.component';
import { FlightTeamsComponent } from './flight-teams/flight-teams.component';
import { FlightScheduleComponent } from './flight-schedule/flight-schedule.component';
import { FlightsService } from '../flights.service';
import {
  FlightDivision,
  FlightInfo,
  FlightStandings,
  FlightStatistics,
  FlightTeam,
} from 'src/app/shared/flight.model';
import { MatchSummary } from 'src/app/shared/match.model';
import { FlightStatisticsComponent } from './flight-statistics/flight-statistics.component';

@Component({
  selector: 'app-flight-home',
  templateUrl: './flight-home.component.html',
  styleUrl: './flight-home.component.css',
  imports: [
    CommonModule,
    ProgressSpinnerModule,
    FlightInfoComponent,
    FlightDivisionsComponent,
    FlightStandingsComponent,
    FlightStatisticsComponent,
    FlightTeamsComponent,
    FlightScheduleComponent,
  ],
})
export class FlightHomeComponent implements OnInit, OnDestroy {
  info: FlightInfo | undefined;
  divisions: FlightDivision[] | undefined;
  teams: FlightTeam[] | undefined;
  standings: FlightStandings | undefined;
  statistics: FlightStatistics | undefined;
  matches: MatchSummary[] | undefined;

  private route = inject(ActivatedRoute);

  private flightsService = inject(FlightsService);
  private infoSub: Subscription;
  private teamsSub: Subscription;
  private standingsSub: Subscription;
  private statisticsSub: Subscription;
  private matchesSub: Subscription;
  private divisionsSub: Subscription;

  ngOnInit(): void {
    this.infoSub = this.flightsService
      .getInfoUpdateListener()
      .subscribe((result) => (this.info = result));
    this.divisionsSub = this.flightsService
      .getDivisionsUpdateListener()
      .subscribe((result) => (this.divisions = result));
    this.teamsSub = this.flightsService
      .getTeamsUpdateListener()
      .subscribe((result) => (this.teams = result));
    this.standingsSub = this.flightsService
      .getStandingsUpdateListener()
      .subscribe((result) => (this.standings = result));
    this.statisticsSub = this.flightsService
      .getStatisticsUpdateListener()
      .subscribe((result) => (this.statistics = result));
    this.matchesSub = this.flightsService
      .getMatchesUpdateListener()
      .subscribe((result) => (this.matches = result));

    this.route.queryParams.subscribe((params) => {
      if (params && params.id) {
        console.log('[FlightHomeComponent] Processing route with query parameter: id=' + params.id);
        const flightId = params.id;

        this.flightsService.getInfo(flightId);
        this.flightsService.getDivisions(flightId);
        this.flightsService.getTeams(flightId);
        this.flightsService.getStandings(flightId);
        this.flightsService.getStatistics(flightId);
        this.flightsService.getMatches(flightId);
      }
    });
  }

  ngOnDestroy(): void {
    this.infoSub.unsubscribe();
    this.divisionsSub.unsubscribe();
    this.teamsSub.unsubscribe();
    this.standingsSub.unsubscribe();
    this.statisticsSub.unsubscribe();
    this.matchesSub.unsubscribe();
  }
}
