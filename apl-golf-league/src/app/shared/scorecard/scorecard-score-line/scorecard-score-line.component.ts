import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";

import { HoleResultData } from "../../hole-result.model";
import { RoundData } from "../../round.model";

@Component({
  selector: "app-scorecard-score-line",
  templateUrl: "./scorecard-score-line.component.html",
  styleUrls: ["./scorecard-score-line.component.css"]
})
export class ScorecardScoreLineComponent implements OnInit, OnChanges {
  @Input() round: RoundData;
  @Input() scoreMode: string = "gross";

  @Input() title: string;
  @Input() subtitle: string;
  @Input() linkToGolferHome: boolean = false;

  @Input() showScores: boolean = true;

  roundScore: number;
  holeScores: number[];
  holeRelativeScores: number[];

  ngOnInit(): void {
    this.updateScores();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['scoreModes'] !== undefined) {
      this.scoreMode = changes['scoreMode'].currentValue;
      this.updateScores();
    }
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

  abs(num: number): number {
    return Math.abs(num);
  }

}
