import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { FlightTeamDataWithMatches } from 'src/app/shared/team.model';
import { TeamsService } from 'src/app/teams/teams.service';
import { FlightsService } from '../flights.service';
import { FlightInfo } from 'src/app/shared/flight.model';
import { TeamInfoComponent } from './team-info/team-info.component';
import { TeamRosterComponent } from './team-roster/team-roster.component';
import { TeamRoundsComponent } from './team-rounds/team-rounds.component';
import { RoundData } from 'src/app/shared/round.model';

@Component({
  selector: 'app-team-home',
  templateUrl: './team-home.component.html',
  styleUrl: './team-home.component.css',
  imports: [CommonModule, ProgressSpinnerModule, TeamInfoComponent, TeamRosterComponent, TeamRoundsComponent],
})
export class TeamHomeComponent implements OnInit, OnDestroy {
  isLoading = true;

  teamData!: FlightTeamDataWithMatches;
  flightInfo!: FlightInfo;

  private teamDataSub: Subscription;
  private teamsService = inject(TeamsService);

  private flightInfoSub: Subscription;
  private flightsService = inject(FlightsService);

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
