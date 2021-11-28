import { Component, Input } from '@angular/core';

import { HoleResultData } from '../../hole-result.model';

@Component({
  selector: "app-scorecard-hole-line",
  templateUrl: "./scorecard-hole-line.component.html",
  styleUrls: ["./scorecard-hole-line.component.css"]
})
export class ScorecardHoleLineComponent {
  @Input() holes: HoleResultData[];
}
