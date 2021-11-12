import { Component, Input, OnInit } from "@angular/core";

import { HoleResultData } from "src/app/shared/hole-result.model";
import { MatchData } from "src/app/shared/match.model";
import { RoundData } from "src/app/shared/round.model";

@Component({
  selector: "app-match-scorecard",
  templateUrl: "./match-scorecard.component.html",
  styleUrls: ["./match-scorecard.component.css"]
})
export class MatchScorecardComponent implements OnInit {
  @Input() match: MatchData;

  scoreMode: string = "gross";
  roundScore: number[];
  holeScores: number[][];
  holeRelativeScores: number[][];

  ngOnInit(): void {
    this.updateScores();
  }

  onScoreModeChanged(scoreMode: string): void {
    this.scoreMode = scoreMode;
    this.updateScores();
  }

  private updateScores(): void {
    this.roundScore = [];
    this.holeScores = [];
    this.holeRelativeScores = [];

    let roundIdx = -1;
    for (let round of this.match.rounds) {
        roundIdx += 1;

        this.roundScore.push(this.getRoundScore(round));

        this.holeScores.push([]);
        this.holeRelativeScores.push([]);
        for (const hole of round.holes) {
            this.holeScores[roundIdx].push(this.getHoleScore(hole));
            this.holeRelativeScores[roundIdx].push(this.getHoleScore(hole) - hole.par);
        }
    }
  }

  private getRoundScore(round: RoundData): number {
    if (this.scoreMode === "adjusted gross") {
      return round.adjusted_gross_score;
    } else if (this.scoreMode === "net") {
      return round.net_score;
    } else {
      return round.gross_score;
    }
  }

  private getHoleScore(hole: HoleResultData): number {
    if (this.scoreMode === "adjusted gross") {
      return hole.adjusted_gross_score;
    } else if (this.scoreMode === "net") {
      return hole.net_score;
    } else {
      return hole.gross_score;
    }
  }

  getRelativeScoreString(score: number, par: number): string {
    const relativeScore = score - par;
    if (relativeScore > 0) {
      return "+" + relativeScore;
    } else if (relativeScore < 0) {
      return "" + relativeScore;
    } else {
      return "E"
    }
  }

}
