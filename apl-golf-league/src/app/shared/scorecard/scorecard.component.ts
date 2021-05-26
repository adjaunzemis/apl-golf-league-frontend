import { Component, OnInit, Input } from '@angular/core';

import { GolfTeeSet } from '../golf-tee-set.model';
import { GolfHole } from '../golf-hole.model';

@Component({
  selector: 'app-scorecard',
  templateUrl: './scorecard.component.html',
  styleUrls: ['./scorecard.component.css']
})
export class ScorecardComponent implements OnInit {
  @Input() teeSet: GolfTeeSet;

  constructor() { }

  ngOnInit(): void {
  }

  computeTotalPar(): number {
    if (!this.teeSet.holes) {
      return -1;
    }
    return this.teeSet.holes.reduce(function(prev: number, cur: GolfHole) {
      return prev + cur.par;
    }, 0);
  }

  computeTotalYardage(): number {
    if (!this.teeSet.holes) {
      return -1;
    }
    return this.teeSet.holes.reduce(function(prev: number, cur: GolfHole) {
      return prev + cur.yardage;
    }, 0);
  }

  // computeTotalGrossScore(): number {
  //   return this.round.holeResults.reduce(function(prev, cur) {
  //     return prev + cur.grossScore;
  //   }, 0);
  // }

  // computeTotalAdjustedGrossScore(): number {
  //   return this.round.holeResults.reduce(function(prev, cur) {
  //     return prev + cur.adjustedGrossScore;
  //   }, 0);
  // }

  // computeTotalNetScore(): number {
  //   return this.round.holeResults.reduce(function(prev, cur) {
  //     return prev + cur.netScore;
  //   }, 0);
  // }

}
