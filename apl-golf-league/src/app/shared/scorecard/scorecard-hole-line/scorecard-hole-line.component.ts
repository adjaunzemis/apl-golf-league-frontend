import { Component, Input, OnInit } from '@angular/core';

import { HoleResultData } from '../../hole-result.model';
import { Hole } from '../../hole.model';

@Component({
  selector: "app-scorecard-hole-line",
  templateUrl: "./scorecard-hole-line.component.html",
  styleUrls: ["./scorecard-hole-line.component.css"]
})
export class ScorecardHoleLineComponent implements OnInit {
  @Input() holes: Hole[];
  @Input() holeResultData: HoleResultData[];

  ngOnInit(): void {
    if (!this.holes) {
      this.holes = this.holeResultData.map(function(holeResult: HoleResultData, index: number, array: HoleResultData[]) {
        return {
          id: -1, // TODO: Add hole id to HoleResultData
          tee_id: -1, // TODO: Add tee id to HoleResultData
          number: holeResult.number,
          par: holeResult.par,
          stroke_index: holeResult.stroke_index,
          yardage: holeResult.yardage
        };
      });
    }
  }
}
