import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

import { HoleResultData } from '../../hole-result.model';
import { Hole } from '../../hole.model';

@Component({
  selector: 'app-scorecard-hole-line',
  templateUrl: './scorecard-hole-line.component.html',
  styleUrls: ['./scorecard-hole-line.component.css'],
  standalone: false,
})
export class ScorecardHoleLineComponent implements OnInit, OnChanges {
  @Input() holes: Hole[] = [];
  @Input() holeResultData: HoleResultData[];

  @Input() selectedScoreMode!: string;
  @Output() selectedScoreModeChange = new EventEmitter<string>();

  @Input() showScoreModeButtons = true;

  ngOnInit(): void {
    if (this.holes.length === 0) {
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
  }

  ngOnChanges(): void {
    if (this.holeResultData) {
      this.holes = [];
    }
    this.ngOnInit();
  }

  onChangeScoreMode(): void {
    this.selectedScoreModeChange.emit(this.selectedScoreMode);
  }
}
