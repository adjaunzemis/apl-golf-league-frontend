import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntypedFormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { GolfersService } from '../golfers.service';
import { RoundsService } from '../../rounds/rounds.service';
import { GolferData, TeamGolferData } from '../../shared/golfer.model';
import { RoundData } from '../../shared/round.model';
import { SeasonsService } from 'src/app/seasons/seasons.service';

@Component({
  selector: 'app-golfer-home',
  templateUrl: './golfer-home.component.html',
  styleUrls: ['./golfer-home.component.css'],
  standalone: false,
})
export class GolferHomeComponent implements OnInit, OnDestroy {
  isLoadingGolferData = true;
  isLoadingTeamData = false;
  isLoadingRoundData = false;

  yearControl = new UntypedFormControl('', Validators.required);

  golferId: number;

  year: number;
  yearOptions: number[];
  seasonsSub: Subscription;

  golfer: GolferData;
  golferSub: Subscription;

  flightTeams: TeamGolferData[] = [];
  tournamentTeams: TeamGolferData[] = [];
  teamsSub: Subscription;

  rounds: RoundData[] = [];
  roundsSub: Subscription;

  roundsOrganizedByTee: Record<number, RoundData[]>;

  showHandicapData = false;

  constructor(
    private golfersService: GolfersService,
    private roundsService: RoundsService,
    private seasonsService: SeasonsService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.golferId = Number(this.route.snapshot.queryParamMap.get('id'));

    this.golferSub = this.golfersService
      .getGolferUpdateListener()
      .subscribe((result: GolferData) => {
        console.log(`[GolferHomeComponent] Received golfer data`);
        this.golfer = result;
        if (result.member_since) {
          const oldestYear = result.member_since;
          this.yearOptions = Array.from(
            { length: this.year - oldestYear + 1 },
            (v, k) => k + oldestYear,
          );
          this.yearOptions.sort((a, b) => b - a); // descending order
        } else {
          this.yearOptions = [this.year];
        }
        this.isLoadingGolferData = false;

        this.getSelectedSeasonData();
      });

    this.roundsSub = this.roundsService.getRoundUpdateListener().subscribe((result) => {
      console.log(`[GolferHomeComponent] Received ${result.length} rounds`);
      if (result.length > 0) {
        this.rounds = result;
      } else {
        this.rounds = [];
      }
      this.organizeRoundsByTee();
      this.isLoadingRoundData = false;
    });

    this.teamsSub = this.golfersService.getGolferTeamDataUpdateListener().subscribe((result) => {
      console.log(`[GolferHomeComponent] Received ${result.length} teams`);
      this.flightTeams = result.filter((team) => team.flight_name);
      this.tournamentTeams = result.filter((team) => team.tournament_name);
      this.isLoadingTeamData = false;
    });

    this.seasonsSub = this.seasonsService.getActiveSeason().subscribe((result) => {
      console.log(`[GolferHomeComponent] Received active season: year=${result.year}`);
      this.year = result.year;

      this.yearOptions = [this.year];
      this.yearControl.setValue(this.year);

      this.getGolferData();
    });
  }

  ngOnDestroy(): void {
    this.golferSub.unsubscribe();
    this.teamsSub.unsubscribe();
    this.roundsSub.unsubscribe();
    this.seasonsSub.unsubscribe();
  }

  onSeasonSelected(year: number): void {
    this.year = year;
    this.getSelectedSeasonData();
  }

  private getSelectedSeasonData(): void {
    console.log(`[GolferHomeComponent] Fetching golfer round data for year=${this.year}`);

    this.isLoadingTeamData = true;
    this.golfersService.getGolferTeamData(this.golferId, this.year);

    this.isLoadingRoundData = true;
    this.roundsService.getRounds(this.golferId, this.year);
  }

  private getTeamData(): void {
    // TODO: Implement this!
  }

  private getGolferData(): void {
    const prevSunday = this.getActiveHandicapDeadline(new Date());
    this.golfersService.getGolfer(this.golferId, prevSunday);
  }

  private getActiveHandicapDeadline(d: Date): Date {
    const t = new Date(d);
    t.setDate(t.getDate() - t.getDay()); // previous Sunday
    return t;
  }

  toggleShowHandicapData(): void {
    this.showHandicapData = !this.showHandicapData;
  }

  private organizeRoundsByTee(): void {
    this.roundsOrganizedByTee = {};
    for (const round of this.rounds) {
      if (!this.roundsOrganizedByTee[round.tee_id]) {
        this.roundsOrganizedByTee[round.tee_id] = [];
      }
      this.roundsOrganizedByTee[round.tee_id].push(round);
    }
  }
}
