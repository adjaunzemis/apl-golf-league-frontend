import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

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

  golferId: number;
  year: number = 2021;

  golfer: GolferData;
  golferSub: Subscription;

  rounds: RoundData[];
  roundsSub: Subscription;

  roundsOrganizedByTee: { [tee_id: number]: RoundData[] };

  showHandicapData: boolean = false;

  constructor(private golfersService: GolfersService, private roundsService: RoundsService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.golferSub = this.golfersService.getGolferUpdateListener()
      .subscribe((result: GolferData) => {
        console.log(`[GolferHomeComponent] Received golfer data`);
        this.golfer = result;
        this.isLoadingGolferData = false;
      });

    this.roundsSub = this.roundsService.getRoundUpdateListener()
      .subscribe((result: { numRounds: number, rounds: RoundData[] }) => {
        console.log(`[GolferHomeComponent] Received ${result.numRounds} rounds`);
        this.rounds = result.rounds;
        this.isLoadingRoundData = true
        this.organizeRoundsByTee();
      })

    this.route.queryParams.subscribe(params => {
      if (params) {
        if (params.id) {
          console.log("[GolferHomeComponent] Setting query parameter id=" + params.id);
          this.golferId = params.id;
        }
      }
    });

    this.getGolferData();
  }

  ngOnDestroy(): void {
    this.golferSub.unsubscribe();
  }

  getGolferData(): void {
    console.log("[GolferHomeComponent] Fetching golfer data");
    this.golfersService.getGolfer(this.golferId);
    this.roundsService.getRounds(0, 100, this.golferId, this.year);
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
