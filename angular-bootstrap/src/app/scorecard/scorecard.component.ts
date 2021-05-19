import { Component, OnInit, Input } from '@angular/core';

import { GolfRound, GolfCourse } from '../shared/golf-models';
import { MOCK_ROUND, WOODHOLME_FRONT_ROUND, TIMBERS_FRONT_ROUND } from '../shared/mock-data';

@Component({
  selector: 'app-scorecard',
  templateUrl: './scorecard.component.html',
  styleUrls: ['./scorecard.component.css']
})
export class ScorecardComponent implements OnInit {
  @Input() course: GolfCourse;
  @Input() round: GolfRound;

  constructor() { }

  ngOnInit(): void {
  }

  computeTotalPar(): number {
    return this.course.holes.reduce(function(prev, cur) {
      return prev + cur.par;
    }, 0);
  }

  computeTotalYardage(): number {
    return this.course.holes.reduce(function(prev, cur) {
      return prev + cur.yardage;
    }, 0);
  }

  computeTotalGrossScore(): number {
    return this.round.holeResults.reduce(function(prev, cur) {
      return prev + cur.grossScore;
    }, 0);
  }

  computeTotalAdjustedGrossScore(): number {
    return this.round.holeResults.reduce(function(prev, cur) {
      return prev + cur.adjustedGrossScore;
    }, 0);
  }

  computeTotalNetScore(): number {
    return this.round.holeResults.reduce(function(prev, cur) {
      return prev + cur.netScore;
    }, 0);
  }

}
