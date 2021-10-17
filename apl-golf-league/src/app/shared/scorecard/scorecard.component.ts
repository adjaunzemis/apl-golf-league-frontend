import { Component, OnInit, Input } from '@angular/core';

import { Tee } from '../tee.model';
import { Hole } from '../hole.model';

@Component({
  selector: 'app-scorecard',
  templateUrl: './scorecard.component.html',
  styleUrls: ['./scorecard.component.css']
})
export class ScorecardComponent implements OnInit {
  @Input() tee: Tee;

  constructor() { }

  ngOnInit(): void {
  }

  computeTotalPar(): number {
    if (!this.tee.holes) {
      return -1;
    }
    return this.tee.holes.reduce(function(prev: number, cur: Hole) {
      return prev + cur.par;
    }, 0);
  }

  computeTotalYardage(): number {
    if (!this.tee.holes) {
      return -1;
    }
    return this.tee.holes.reduce(function(prev: number, cur: Hole) {
      return cur.yardage ? prev + cur.yardage : 0;
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
