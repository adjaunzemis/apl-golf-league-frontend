import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AppConfigService } from '../../app-config.service';
import { GolfersService } from '../golfers.service';
import { RoundsService } from '../../rounds/rounds.service';
import { GolferData } from '../../shared/golfer.model';
import { RoundData } from '../../shared/round.model';

@Component({
  selector: 'app-golfer-home',
  templateUrl: './golfer-home.component.html',
  styleUrls: ['./golfer-home.component.css']
})
export class GolferHomeComponent implements OnInit, OnDestroy {
  isLoadingGolferData = true;
  isLoadingRoundData = true;

  yearControl = new FormControl('', Validators.required);

  golferId: number;
  year: number;
  yearOptions: number[];

  golfer: GolferData;
  golferSub: Subscription;

  rounds: RoundData[] = [];
  roundsSub: Subscription;

  roundsOrganizedByTee: { [tee_id: number]: RoundData[] };

  showHandicapData: boolean = false;

  constructor(private appConfigService: AppConfigService, private golfersService: GolfersService, private roundsService: RoundsService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.year = this.appConfigService.currentYear;
    this.yearOptions = [this.year];
    this.yearControl.setValue(this.year);

    this.golferSub = this.golfersService.getGolferUpdateListener()
      .subscribe((result: GolferData) => {
        console.log(`[GolferHomeComponent] Received golfer data`);
        this.golfer = result;
        if (result.member_since) {
          const oldestYear = result.member_since;
          this.yearOptions = Array.from({ length: this.appConfigService.currentYear - oldestYear + 1 }, (v, k) => k + oldestYear);
          this.yearOptions.sort((a, b) => b - a); // descending order
        } else {
          this.yearOptions = [this.year];
        }
        this.isLoadingGolferData = false;

        this.getSelectedSeasonData();
      });

    this.roundsSub = this.roundsService.getRoundUpdateListener()
      .subscribe((result: { numRounds: number, rounds: RoundData[] }) => {
        console.log(`[GolferHomeComponent] Received ${result.numRounds} rounds`);
        if (result.numRounds > 0) {
          this.rounds = result.rounds;
        } else {
          this.rounds = [];
        }
        this.organizeRoundsByTee();
        this.isLoadingRoundData = false;
      })

    this.route.queryParams.subscribe(params => {
      if (params) {
        if (params.id) {
          this.golferId = params.id;
        }
      }
    });

    this.getGolferData();
  }

  ngOnDestroy(): void {
    this.golferSub.unsubscribe();
  }

  onSeasonSelected(year: number): void {
    this.year = year;
    this.getSelectedSeasonData();
  }

  private getSelectedSeasonData(): void {
    console.log(`[GolferHomeComponent] Fetching golfer round data for year=${this.year}`);
    this.isLoadingRoundData = true;
    this.roundsService.getRounds(0, 100, this.golferId, this.year); // TODO: remove unneeded limit/offset
  }

  private getTeamData(): void {
    // TODO: Implement this!
  }

  private getGolferData(): void {
    this.golfersService.getGolfer(this.golferId);
  }

  toggleShowHandicapData(): void {
    this.showHandicapData = !this.showHandicapData;
  }

  private organizeRoundsByTee(): void {
    this.roundsOrganizedByTee = {};
    for (let round of this.rounds) {
      if (!this.roundsOrganizedByTee[round.tee_id]) {
        this.roundsOrganizedByTee[round.tee_id] = [];
      }
      this.roundsOrganizedByTee[round.tee_id].push(round);
    }
  }

}
