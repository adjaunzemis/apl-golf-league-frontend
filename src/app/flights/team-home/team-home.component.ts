import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { FlightTeamDataWithMatches } from 'src/app/shared/team.model';
import { TeamsService } from 'src/app/teams/teams.service';
import { FlightsService } from '../flights.service';
import { FlightInfo, FlightStandingsTeam, FlightStatistics } from 'src/app/shared/flight.model';
import { TeamInfoComponent } from './team-info/team-info.component';
import { TeamRosterComponent } from './team-roster/team-roster.component';
import { TeamRoundsComponent } from './team-rounds/team-rounds.component';
import { RoundData } from 'src/app/shared/round.model';
import { TeamScheduleComponent } from './team-schedule/team-schedule.component';
import { FlightStatisticsComponent } from '../flight-home/flight-statistics/flight-statistics.component';
import { MatchSummary } from 'src/app/shared/match.model';

@Component({
  selector: 'app-team-home',
  templateUrl: './team-home.component.html',
  styleUrl: './team-home.component.css',
  imports: [
    ProgressSpinnerModule,
    TeamInfoComponent,
    TeamRosterComponent,
    TeamRoundsComponent,
    TeamScheduleComponent,
    FlightStatisticsComponent
],
})
export class TeamHomeComponent implements OnInit, OnDestroy {
  isLoading = true;

  teamData!: FlightTeamDataWithMatches;
  flightInfo!: FlightInfo;
  teamStandings: FlightStandingsTeam | undefined;
  statistics: FlightStatistics | undefined;
  teamMatches: MatchSummary[] | undefined;

  private teamDataSub: Subscription;
  private teamsService = inject(TeamsService);

  private flightInfoSub: Subscription;
  private flightsService = inject(FlightsService);

  private teamStandingsSub: Subscription;
  private teamStatisticsSub: Subscription;
  private teamMatchesSub: Subscription;

  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.flightInfoSub = this.flightsService.getInfoUpdateListener().subscribe((result) => {
      this.flightInfo = result;
      this.isLoading = false;
    });

    this.teamDataSub = this.teamsService.getFlightTeamDataUpdateListener().subscribe((result) => {
      console.log(`[TeamHomeComponent] Received team data for '${result.name}'`);
      this.teamData = result;

      this.flightsService.getInfo(result.flight_id);
      this.flightsService.getStandings(result.flight_id);
      this.flightsService.getStatistics(result.flight_id);
      this.flightsService.getMatches(result.flight_id);
    });

    this.teamStandingsSub = this.flightsService.getStandingsUpdateListener().subscribe((result) => {
      for (const teamStandings of result.teams) {
        if (teamStandings.team_id === this.teamData.id) {
          this.teamStandings = teamStandings;
        }
      }
    });

    this.teamStatisticsSub = this.flightsService
      .getStatisticsUpdateListener()
      .subscribe((result) => {
        const teamStatistics = [];
        for (const golferStatistics of result.golfers) {
          if (golferStatistics.golfer_team_id === this.teamData.id) {
            teamStatistics.push(golferStatistics);
          }
        }
        this.statistics = {
          flight_id: result.flight_id,
          golfers: teamStatistics,
        };
      });

    this.teamMatchesSub = this.flightsService.getMatchesUpdateListener().subscribe((result) => {
      this.teamMatches = [];
      for (const match of result) {
        if (match.home_team_id === this.teamData.id || match.away_team_id === this.teamData.id) {
          this.teamMatches.push(match);
        }
      }
    });

    this.route.queryParams.subscribe((params) => {
      if (params && params.id) {
        console.log('[TeamHomeComponent] Processing route with query parameter: id=' + params.id);
        const teamId = params.id;

        this.teamsService.getFlightTeamData(teamId);
      }
    });
  }

  ngOnDestroy(): void {
    this.teamDataSub.unsubscribe();
    this.flightInfoSub.unsubscribe();
    this.teamStandingsSub.unsubscribe();
    this.teamStatisticsSub.unsubscribe();
    this.teamMatchesSub.unsubscribe();
  }

  getRounds(): RoundData[] {
    if (!this.teamData) {
      return [];
    }
    const rounds: RoundData[] = [];
    for (const match of this.teamData.matches) {
      for (const round of match.rounds) {
        if (round.team_id === this.teamData.id) {
          rounds.push(round);
        }
      }
    }
    return rounds;
  }
}
