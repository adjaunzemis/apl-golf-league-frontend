import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";

import { MatchData } from "src/app/shared/match.model";

@Component({
  selector: "app-match-scorecard",
  templateUrl: "./match-scorecard.component.html",
  styleUrls: ["./match-scorecard.component.css"]
})
export class MatchScorecardComponent implements OnInit, OnChanges {
  @Input() match: MatchData;
  @Input() topTeamId: number;
  bottomTeamId: number;

  scoreMode: string = "gross";

  roundIdx: number = 0;

  ngOnInit(): void {
    this.setTopAndBottomTeamIds();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes.topTeamId) {
      this.topTeamId = changes.topTeamId.currentValue;
    }
    this.setTopAndBottomTeamIds();
  }

  onScoreModeChanged(scoreMode: string): void {
    this.scoreMode = scoreMode;
  }

  private setTopAndBottomTeamIds(): void {
    if (!this.topTeamId) {
      this.topTeamId = this.match.home_team_id;
    }
    this.bottomTeamId = this.topTeamId === this.match.home_team_id ? this.match.away_team_id : this.match.home_team_id;
  }

}
