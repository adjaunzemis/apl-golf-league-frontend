import { Component, OnInit } from '@angular/core';

import { GolfRound } from '../shared/golf-models';
import { MOCK_ROUND } from '../shared/mock-data';

@Component({
  selector: 'app-scorecard',
  templateUrl: './scorecard.component.html',
  styleUrls: ['./scorecard.component.css']
})
export class ScorecardComponent implements OnInit {

  round: GolfRound;

  constructor() { }

  ngOnInit(): void {
    this.round = MOCK_ROUND;
  }

  getScoreClass(score: number, par: number): string {
    const scoreToPar = score - par;
    if (scoreToPar < -2) {
      return "'circle crosshatch'";
    } else if (scoreToPar < -1) {
      return "'circle'";
    } else if (scoreToPar == 0) {
      return "";
    } else if (scoreToPar == 1) {
      return "'square'";
    } else {
      return "'square crosshatch'";
    }
  }

  computeTotalPar(): number {
    return this.round.holeResults.reduce(function(prev, cur) {
      return prev + cur.hole.par;
    }, 0);
  }

  computeTotalYardage(): number {
    return this.round.holeResults.reduce(function(prev, cur) {
      return prev + cur.hole.yardage;
    }, 0);
  }

  computeTotalNetScore(): number {
    return this.round.holeResults.reduce(function(prev, cur) {
      return prev + cur.netScore;
    }, 0);
  }

  computeTotalGrossScore(): number {
    return this.round.holeResults.reduce(function(prev, cur) {
      return prev + cur.grossScore;
    }, 0);
  }

}
