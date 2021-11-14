import { Component, Input, OnInit } from "@angular/core";

import { MatchData } from "src/app/shared/match.model";
import { RoundData } from "src/app/shared/round.model";

@Component({
  selector: "app-match-scorecard-score-line",
  templateUrl: "./match-scorecard-score-line.component.html",
  styleUrls: ["./match-scorecard-score-line.component.css"]
})
export class MatchScorecardScoreLineComponent implements OnInit {
  @Input() match: MatchData;

  @Input() homeTeamId: number;
  @Input() awayTeamId: number;

  homeTeamRounds: RoundData[] = [];
  awayTeamRounds: RoundData[] = [];

  homeTeamHoleNetScores: number[] = [];
  awayTeamHoleNetScores: number[] = [];

  winningTeamId: number;

  ngOnInit(): void {
    // Separate match rounds by team
    for (let round of this.match.rounds) {
      if (round.team_id === this.homeTeamId) {
        this.homeTeamRounds.push(round);
      } else if (round.team_id === this.awayTeamId) {
        this.awayTeamRounds.push(round);
      }
    }

    // Compute hole net scores for each team
    for (let holeIdx = 0; holeIdx < this.match.rounds[0].holes.length; holeIdx++) {
      this.homeTeamHoleNetScores[holeIdx] = 0;
      for (let round of this.homeTeamRounds) {
        this.homeTeamHoleNetScores[holeIdx] += round.holes[holeIdx].net_score;
      }

      this.awayTeamHoleNetScores[holeIdx] = 0;
      for (let round of this.awayTeamRounds) {
        this.awayTeamHoleNetScores[holeIdx] += round.holes[holeIdx].net_score;
      }
    }

    // Determine winning team
    let homeTeamTotalNetScore = this.homeTeamHoleNetScores.reduce(function(prev: number, cur: number) {
      return prev + cur;
    }, 0);

    let awayTeamTotalNetScore = this.awayTeamHoleNetScores.reduce(function(prev: number, cur: number) {
      return prev + cur;
    }, 0);

    this.winningTeamId = homeTeamTotalNetScore < awayTeamTotalNetScore ? this.homeTeamId : awayTeamTotalNetScore < homeTeamTotalNetScore ? this.awayTeamId : -1;
  }
}
