import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";

import { HoleResultData } from "../../../shared/hole-result.model";
import { RoundData } from "../../../shared/round.model";

@Component({
    selector: "app-average-score-line",
    templateUrl: "./average-score-line.component.html",
    styleUrls: ["./average-score-line.component.css"],
    standalone: false
})
export class AverageScoreLineComponent implements OnInit, OnChanges {
  @Input() rounds: RoundData[];
  @Input() scoreMode: string = "gross";

  @Input() title: string;

  roundScore: number;
  holeScores: number[];

  ngOnInit(): void {
    this.updateScores();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.scoreMode = changes['scoreMode'].currentValue;
    this.updateScores();
  }

  private updateScores(): void {
    this.roundScore = 0;
    this.holeScores = [];

    let roundNum = 0;
    for (const round of this.rounds) {
      roundNum += 1;
      for (let holeIdx = 0; holeIdx < round.holes.length; holeIdx++) {
        const hole = round.holes[holeIdx];
        if (roundNum == 1) {
          this.holeScores.push(this.getHoleScore(hole));
        } else {
          this.holeScores[holeIdx] = this.holeScores[holeIdx] + (this.getHoleScore(hole) - this.holeScores[holeIdx]) / roundNum;
        }
      }
    }

    this.roundScore = this.holeScores.reduce((prev, cur) => prev + cur);
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
      return "+" + relativeScore.toFixed(1);
    } else if (relativeScore < 0) {
      return "" + relativeScore.toFixed(1);
    } else {
      return "E"
    }
  }

}
