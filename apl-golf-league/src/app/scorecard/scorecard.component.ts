import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scorecard',
  templateUrl: './scorecard.component.html',
  styleUrls: ['./scorecard.component.css']
})
export class ScorecardComponent implements OnInit {

  holes = [
    new GolfHole(1, 5, 9, 510, 2, 2),
    new GolfHole(2, 4, 8, 380, 2, 2),
    new GolfHole(3, 5, 7, 510, 4, 4),
    new GolfHole(4, 4, 6, 380, 4, 4),
    new GolfHole(5, 3, 5, 155, 4, 4),
    new GolfHole(6, 4, 4, 380, 6, 6),
    new GolfHole(7, 4, 3, 380, 7, 7),
    new GolfHole(8, 3, 2, 155, 3, 4),
    new GolfHole(9, 4, 1, 380, 4, 3)
  ];

  constructor() { }

  ngOnInit(): void {
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
    return this.holes.reduce(function(prev, cur) {
      return prev + cur.par;
    }, 0);
  }

  computeTotalYardage(): number {
    return this.holes.reduce(function(prev, cur) {
      return prev + cur.yardage;
    }, 0);
  }

  computeTotalNetScore(): number {
    return this.holes.reduce(function(prev, cur) {
      return prev + cur.netScore;
    }, 0);
  }

  computeTotalGrossScore(): number {
    return this.holes.reduce(function(prev, cur) {
      return prev + cur.grossScore;
    }, 0);
  }

}

class GolfHole {
  number: number;
  par: number;
  handicap: number;
  yardage: number;
  grossScore: number;
  netScore: number;
  handicapStrokes: number;

  constructor(number: number, par: number, handicap: number, yardage: number, grossScore: number, netScore: number) {
    this.number = number;
    this.par = par;
    this.handicap = handicap;
    this.yardage = yardage;
    this.grossScore = grossScore;
    this.netScore = netScore;

    this.handicapStrokes = grossScore - netScore;
  }
}
