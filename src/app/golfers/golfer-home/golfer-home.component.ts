import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { GolferInfoComponent } from './golfer-info/golfer-info.component';
import { GolfersService } from '../golfers.service';
import { GolferData, GolferStatistics, TeamGolferData } from 'src/app/shared/golfer.model';
import { Season } from 'src/app/shared/season.model';
import { RoundData } from 'src/app/shared/round.model';
import { RoundsService } from 'src/app/rounds/rounds.service';
import { SeasonsService } from 'src/app/seasons/seasons.service';
import { GolferTeamsComponent } from './golfer-teams/golfer-teams.component';
import { FlightsService } from 'src/app/flights/flights.service';
import { TournamentsService } from 'src/app/tournaments/tournaments.service';
import { TournamentInfo } from 'src/app/shared/tournament.model';
import { FlightInfo } from 'src/app/shared/flight.model';
import { GolferRoundsComponent } from './golfer-rounds/golfer-rounds.component';
import { GolferHandicapComponent } from './golfer-handicap/golfer-handicap.component';
import { ScoringRecordRound } from 'src/app/shared/handicap.model';
import { GolferStatisticsComponent } from './golfer-statistics/golfer-statistics.component';

@Component({
  selector: 'app-golfer-home',
  templateUrl: './golfer-home.component.html',
  styleUrl: './golfer-home.component.css',
  imports: [
    FormsModule,
    CardModule,
    SelectModule,
    TagModule,
    ProgressSpinnerModule,
    GolferInfoComponent,
    GolferTeamsComponent,
    GolferRoundsComponent,
    GolferHandicapComponent,
    GolferStatisticsComponent,
  ],
})
export class GolferHomeComponent implements OnInit, OnDestroy {
  isLoading = true;

  golferId: number;

  private golferSub: Subscription;
  golfer: GolferData;

  private golferHandicapScoringRecordSub: Subscription;
  golferHandicapScoringRecord: ScoringRecordRound[];

  private seasonsSub: Subscription;
  seasons: Season[];
  selectedSeason: Season;

  private teamsSub: Subscription;
  teams: TeamGolferData[] = [];

  private roundsSub: Subscription;
  rounds: RoundData[] = [];

  private statisticsSub: Subscription;
  statistics: GolferStatistics;

  private flightInfoSub: Subscription;
  flightInfo: FlightInfo[] = [];

  private tournamentInfoSub: Subscription;
  tournamentInfo: TournamentInfo[] = [];

  private golfersService = inject(GolfersService);
  private roundsService = inject(RoundsService);
  private seasonsService = inject(SeasonsService);
  private flightsService = inject(FlightsService);
  private tournamentsService = inject(TournamentsService);

  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.seasonsSub = this.seasonsService.getSeasons().subscribe((result) => {
      this.seasons = [...result];
      this.selectedSeason = result.filter((season) => season.is_active)[0];
      this.getSelectedSeasonData();
    });

    this.golferSub = this.golfersService.getGolferUpdateListener().subscribe((result) => {
      this.golfer = result;
      this.updateIsLoading();
    });

    this.golferHandicapScoringRecordSub = this.golfersService
      .getGolferHandicapScoringRecordUpdateListener()
      .subscribe((result) => {
        this.golferHandicapScoringRecord = [...result];
        this.updateIsLoading();
      });

    this.roundsSub = this.roundsService.getRoundUpdateListener().subscribe((result) => {
      console.log(`[GolferHomeComponent] Received ${result.length} rounds`);
      if (result.length > 0) {
        this.rounds = result;
      } else {
        this.rounds = [];
      }
      this.updateIsLoading();
    });

    this.statisticsSub = this.golfersService
      .getGolferStatisticsUpdateListener()
      .subscribe((result) => {
        console.log(
          `[GolferHomeComponent] Received golfer statistics with ${result.num_rounds} rounds of data`,
        );
        this.statistics = result;
        this.updateIsLoading();
      });

    this.teamsSub = this.golfersService.getGolferTeamDataUpdateListener().subscribe((result) => {
      console.log(`[GolferHomeComponent] Received ${result.length} teams`);
      this.teams = [...result];
      this.updateIsLoading();
    });

    this.flightInfoSub = this.flightsService.getListUpdateListener().subscribe((result) => {
      this.flightInfo = [...result];
      this.updateIsLoading();
    });

    this.tournamentInfoSub = this.tournamentsService.getListUpdateListener().subscribe((result) => {
      this.tournamentInfo = [...result];
      this.updateIsLoading();
    });

    this.route.queryParams.subscribe((params) => {
      if (params && params.id) {
        console.log('[GolferHomeComponent] Processing route with query parameter: id=' + params.id);
        this.golferId = params.id;

        const prevSunday = this.getActiveHandicapDeadline(new Date());
        this.golfersService.getGolfer(this.golferId, prevSunday);
        this.getSelectedSeasonData();
      }
    });
  }

  ngOnDestroy(): void {
    this.seasonsSub.unsubscribe();
    this.golferSub.unsubscribe();
    this.golferHandicapScoringRecordSub.unsubscribe();
    this.teamsSub.unsubscribe();
    this.roundsSub.unsubscribe();
    this.statisticsSub.unsubscribe();
    this.flightInfoSub.unsubscribe();
    this.tournamentInfoSub.unsubscribe();
  }

  onSeasonSelected(): void {
    this.getSelectedSeasonData();
  }

  private getActiveHandicapDeadline(d: Date): Date {
    const t = new Date(d);
    t.setDate(t.getDate() - t.getDay()); // previous Sunday
    return t;
  }

  private getSelectedSeasonData(): void {
    if (this.golferId && this.selectedSeason) {
      console.log(
        `[GolferHomeComponent] Fetching golfer round data for year=${this.selectedSeason.year}`,
      );
      this.isLoading = true;

      this.golfersService.getGolferTeamData(this.golferId, this.selectedSeason.year);
      this.golfersService.getGolferHandicapScoringRecord(this.golferId, this.selectedSeason.year);
      this.golfersService.getGolferStatistics(this.golferId, this.selectedSeason.year);
      this.roundsService.getRounds(this.golferId, this.selectedSeason.year);
      this.flightsService.getList(this.selectedSeason.year);
      this.tournamentsService.getList(this.selectedSeason.year);
    }
  }

  private updateIsLoading(): void {
    this.isLoading = !(
      this.golfer &&
      this.golferHandicapScoringRecord &&
      this.rounds &&
      this.statistics &&
      this.teams &&
      this.flightInfo &&
      this.tournamentInfo
    );
  }
}
