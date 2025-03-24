import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { TournamentInfoComponent } from './tournament-info/tournament-info.component';
import { TournamentDivisionsComponent } from './tournament-divisions/tournament-divisions.component';
import { TournamentTeamsComponent } from './tournament-teams/tournament-teams.component';
import { TournamentStandingsComponent } from './tournament-standings/tournament-standings.component';
import { TournamentStatisticsComponent } from './tournament-statistics/tournament-statistics.component';
import { TournamentsService } from '../tournaments.service';
import {
  TournamentDivision,
  TournamentInfo,
  TournamentStandings,
  TournamentStatistics,
  TournamentTeam,
} from 'src/app/shared/tournament.model';
import { RoundSummary } from 'src/app/shared/round.model';

@Component({
  selector: 'app-tournament-home',
  templateUrl: './tournament-home.component.html',
  styleUrl: './tournament-home.component.css',
  imports: [
    CommonModule,
    ProgressSpinnerModule,
    TournamentInfoComponent,
    TournamentDivisionsComponent,
    TournamentStandingsComponent,
    TournamentStatisticsComponent,
    TournamentTeamsComponent,
  ],
})
export class TournamentHomeComponent implements OnInit, OnDestroy {
  info: TournamentInfo | undefined;
  divisions: TournamentDivision[] | undefined;
  teams: TournamentTeam[] | undefined;
  standings: TournamentStandings | undefined;
  statistics: TournamentStatistics | undefined;
  rounds: RoundSummary[] | undefined;

  private route = inject(ActivatedRoute);

  private tournamentsService = inject(TournamentsService);
  private infoSub: Subscription;
  private divisionsSub: Subscription;
  private teamsSub: Subscription;
  private standingsSub: Subscription;
  private statisticsSub: Subscription;
  private roundsSub: Subscription;

  ngOnInit(): void {
    this.infoSub = this.tournamentsService
      .getInfoUpdateListener()
      .subscribe((result) => (this.info = result));
    this.divisionsSub = this.tournamentsService
      .getDivisionsUpdateListener()
      .subscribe((result) => (this.divisions = result));
    this.teamsSub = this.tournamentsService
      .getTeamsUpdateListener()
      .subscribe((result) => (this.teams = result));
    this.standingsSub = this.tournamentsService
      .getStandingsUpdateListener()
      .subscribe((result) => (this.standings = result));
    this.statisticsSub = this.tournamentsService
      .getStatisticsUpdateListener()
      .subscribe((result) => (this.statistics = result));
    this.roundsSub = this.tournamentsService
      .getRoundsUpdateListener()
      .subscribe((result) => (this.rounds = result));

    this.route.queryParams.subscribe((params) => {
      if (params && params.id) {
        console.log(
          '[TournamentHomeComponent] Processing route with query parameter: id=' + params.id,
        );
        const tournamentId = params.id;

        this.tournamentsService.getInfo(tournamentId);
        this.tournamentsService.getDivisions(tournamentId);
        this.tournamentsService.getTeams(tournamentId);
        this.tournamentsService.getStandings(tournamentId);
        this.tournamentsService.getStatistics(tournamentId);
        this.tournamentsService.getRounds(tournamentId);
      }
    });
  }

  ngOnDestroy(): void {
    this.infoSub.unsubscribe();
    this.divisionsSub.unsubscribe();
    this.teamsSub.unsubscribe();
    this.standingsSub.unsubscribe();
    this.statisticsSub.unsubscribe();
    this.roundsSub.unsubscribe();
  }
}
