import { Component, Input, OnInit } from "@angular/core";

import { RoundSummary } from "src/app/shared/round.model";
import { HoleResultSummary } from "src/app/shared/hole-result.model";

@Component({
  selector: "app-round-scorecard",
  templateUrl: "./round-scorecard.component.html",
  styleUrls: ["./round-scorecard.component.css"]
})
export class RoundScorecardComponent implements OnInit {
  @Input() round: RoundSummary;

  roundPar: number;
  holeHandicapStrokes: number[];

  scoreMode: string = "gross";
  roundScore: number;
  holeScores: number[];
  holeRelativeScores: number[];

  ngOnInit(): void {
    this.roundPar = this.computeRoundPar();

    this.holeHandicapStrokes = [];
    for (const hole of this.round.round_holes) {
      this.holeHandicapStrokes.push(this.computeHoleHandicapStrokes(hole.hole_stroke_index));
    }

    this.updateScores();
  }

  onScoreModeChanged(scoreMode: string): void {
    this.scoreMode = scoreMode;
    this.updateScores();
  }

  private updateScores(): void {
    this.roundScore = this.computeRoundScore();

    this.holeScores = [];
    this.holeRelativeScores = [];
    for (const hole of this.round.round_holes) {
      this.holeScores.push(this.computeHoleScore(hole));
      this.holeRelativeScores.push(this.computeHoleScore(hole) - hole.hole_par);
    }
  }

  private computeRoundPar(): number {
    if (!this.round.round_holes) {
      return -1;
    }
    return this.round.round_holes.reduce(function(prev: number, cur: HoleResultSummary) {
      return prev + cur.hole_par;
    }, 0);
  }

  private computeRoundScore(): number {
    if (this.scoreMode === "adjusted gross") {
      return this.computeRoundAdjustedGrossScore();
    } else if (this.scoreMode === "net") {
      return this.computeRoundNetScore();
    } else {
      return this.computeRoundGrossScore();
    }
  }

  private computeHoleScore(hole: HoleResultSummary): number {
    if (this.scoreMode === "adjusted gross") {
      return this.computeHoleAdjustedGrossScore(hole);
    } else if (this.scoreMode === "net") {
      return this.computeHoleNetScore(hole);
    } else {
      return hole.hole_result_strokes;
    }
  }

  private computeRoundGrossScore(): number {
    if (!this.round.round_holes) {
      return -1;
    }
    return this.round.round_holes.reduce(function(prev: number, cur: HoleResultSummary) {
      return prev + cur.hole_result_strokes;
    }, 0);
  }

  private computeHoleAdjustedGrossScore(hole: HoleResultSummary): number {
    // TODO Account for equitable stroke control
    // TODO Compute on backend, store in database with results?
    return hole.hole_result_strokes;
  }

  private computeRoundAdjustedGrossScore(): number {
    // TODO Account for equitable stroke control
    // TODO Compute on backend, store in database with results?
    if (!this.round.round_holes) {
      return -1;
    }
    return this.round.round_holes.reduce(function(prev: number, cur: HoleResultSummary) {
      return prev + cur.hole_result_strokes;
    }, 0);
  }

  private computeHoleHandicapStrokes(holeStrokeIndex: number): number {
    // TODO Compute on backend, store in database with results?
    if (this.round.golfer_handicap_index < 0) {
      return 0; // TODO Account for plus-handicap golfers
    }
    if (this.round.golfer_handicap_index < 19) {
      if (holeStrokeIndex <= this.round.golfer_handicap_index) {
        return 1;
      }
      return 0;
    }
    if (this.round.golfer_handicap_index < 37) {
      if (holeStrokeIndex <= this.round.golfer_handicap_index - 18) {
        return 2;
      }
      return 1;
    }
    if (this.round.golfer_handicap_index < 55) {
      if (holeStrokeIndex <= this.round.golfer_handicap_index - 18) {
        return 3;
      }
      return 2;
    }
    return 0;
  }

  private computeHoleNetScore(hole: HoleResultSummary): number {
    return hole.hole_result_strokes - this.computeHoleHandicapStrokes(hole.hole_stroke_index);
  }

  private computeRoundNetScore(): number {
    if (!this.round.round_holes) {
      return -1;
    }
    let score = 0;
    for (const hole of this.round.round_holes) {
      score += this.computeHoleNetScore(hole);
    }
    return score;
  }

  getRelativeScoreString(score: number, par: number): string {
    const relativeScore = score - par;
    if (relativeScore > 0) {
      return "+" + relativeScore;
    } else if (relativeScore < 0) {
      return "-" + relativeScore;
    } else {
      return "E"
    }
  }

}
