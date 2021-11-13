import { Component, Input, OnInit } from "@angular/core";

import { HoleResultData } from "src/app/shared/hole-result.model";
import { RoundData } from "src/app/shared/round.model";

@Component({
  selector: "app-scorecard-score-line",
  templateUrl: "./scorecard-score-line.component.html",
  styleUrls: ["./scorecard-score-line.component.css"]
})
export class ScorecardScoreLineComponent implements OnInit {
  @Input() round: RoundData;

  scoreMode: string = "gross";

  roundScore: number;
  holeScores: number[];
  holeRelativeScores: number[];

  ngOnInit(): void {
    this.updateScores();
  }

  onScoreModeChanged(scoreMode: string): void {
    this.scoreMode = scoreMode;
    this.updateScores();
  }

  private updateScores(): void {
    this.roundScore = 0;
    this.holeScores = [];
    this.holeRelativeScores = [];

    this.roundScore = this.getRoundScore();

    for (const hole of this.round.holes) {
        this.holeScores.push(this.getHoleScore(hole));
        this.holeRelativeScores.push(this.getHoleScore(hole) - hole.par);
    }
  }

  private getRoundScore(): number {
    if (this.scoreMode === "adjusted gross") {
      return this.round.adjusted_gross_score;
    } else if (this.scoreMode === "net") {
      return this.round.net_score;
    } else {
      return this.round.gross_score;
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
