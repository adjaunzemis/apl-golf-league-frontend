import { Component, Input } from "@angular/core";

import { MatchData } from "src/app/shared/match.model";

@Component({
  selector: "app-match-scorecard",
  templateUrl: "./match-scorecard.component.html",
  styleUrls: ["./match-scorecard.component.css"]
})
export class MatchScorecardComponent {
  @Input() match: MatchData;
  scoreMode: string = "gross";

  roundIdx: number = 0;

  onScoreModeChanged(scoreMode: string): void {
    this.scoreMode = scoreMode;
  }

}
