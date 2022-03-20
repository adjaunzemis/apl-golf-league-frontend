import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";

import { MatchData } from "../../shared/match.model";
import { RoundData } from "../../shared/round.model";

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
    if (changes.topTeamId) {
      this.topTeamId = changes.topTeamId.currentValue;
    }
    this.setTopAndBottomTeamIds();
  }

  private setTopAndBottomTeamIds(): void {
    if (!this.topTeamId) {
      this.topTeamId = this.match.home_team_id;
    }
    this.bottomTeamId = this.topTeamId === this.match.home_team_id ? this.match.away_team_id : this.match.home_team_id;
  }

  getMatchTitle(): string {
    return this.match.rounds[0].course_name + " - " + this.match.rounds[0].track_name;
  }

  getMatchSubtitle(): string {
    return new Date(this.match.rounds[0].date_played).toLocaleDateString('en-us', { weekday: "long", year:"numeric", month:"long", day:"numeric"});
  }

  getRoundSubtitle(round: RoundData): string {
    return round.tee_name + " - PH: " + (round.golfer_playing_handicap ? round.golfer_playing_handicap.toFixed(0) : '--');
  }

}
