import { Component, Input, OnChanges, OnInit } from '@angular/core';

import { HoleResultData } from '../../hole-result.model';
import { Hole } from '../../hole.model';

@Component({
  selector: 'app-scorecard-tee-info',
  templateUrl: './scorecard-tee-info.component.html',
  styleUrls: ['./scorecard-tee-info.component.css'],
  standalone: false,
})
export class ScorecardTeeInfoComponent implements OnInit, OnChanges {
  @Input() showDetails = false;

  @Input() holes: Hole[] = [];
  @Input() holeResultData: HoleResultData[];

  @Input() name: string;
  @Input() gender: string;
  @Input() rating: number;
  @Input() slope: number;
  @Input() color = 'none';

  totalPar = 0;
  totalYardage = 0;

  ngOnInit(): void {
    if (this.holes.length == 0) {
      this.holes = this.holeResultData.map(function (holeResult: HoleResultData) {
        return {
          id: holeResult.hole_id,
          number: holeResult.number,
          par: holeResult.par,
          stroke_index: holeResult.stroke_index,
          yardage: holeResult.yardage,
        };
      });
    }

    this.totalPar = this.holes.reduce(function (prev: number, cur: Hole) {
      return cur.par ? prev + cur.par : 0;
    }, 0);

    this.totalYardage = this.holes.reduce(function (prev: number, cur: Hole) {
      return cur.yardage ? prev + cur.yardage : 0;
    }, 0);
  }

  ngOnChanges(): void {
    if (this.holeResultData) {
      this.holes = [];
    }
    this.ngOnInit();
  }

  toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }
}
