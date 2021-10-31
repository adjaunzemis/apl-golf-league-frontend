import { Component, Input } from "@angular/core";

import { RoundSummary } from "src/app/shared/round.model";
import { HoleResultSummary } from "src/app/shared/hole-result.model";

@Component({
  selector: "app-round-scorecard",
  templateUrl: "./round-scorecard.component.html",
  styleUrls: ["./round-scorecard.component.css"]
})
export class RoundScorecardComponent {
  @Input() round: RoundSummary;

  computeRoundPar(): number {
    if (!this.round.round_holes) {
      return -1;
    }
    return this.round.round_holes.reduce(function(prev: number, cur: HoleResultSummary) {
      return prev + cur.hole_par;
    }, 0);
  }

  computeRoundGrossScore(): number {
    if (!this.round.round_holes) {
      return -1;
    }
    return this.round.round_holes.reduce(function(prev: number, cur: HoleResultSummary) {
      return prev + cur.hole_result_strokes;
    }, 0);
  }

  computeHoleAdjustedGrossScore(hole: HoleResultSummary): number {
    // TODO Account for equitable stroke control
    // TODO Compute on backend, store in database with results?
    return hole.hole_result_strokes;
  }

  computeRoundAdjustedGrossScore(): number {
    // TODO Account for equitable stroke control
    // TODO Compute on backend, store in database with results?
    if (!this.round.round_holes) {
      return -1;
    }
    return this.round.round_holes.reduce(function(prev: number, cur: HoleResultSummary) {
      return prev + cur.hole_result_strokes;
    }, 0);
  }

  computeHoleHandicapStrokes(holeStrokeIndex: number): number {
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

  computeHoleNetScore(hole: HoleResultSummary): number {
    return hole.hole_result_strokes - this.computeHoleHandicapStrokes(hole.hole_stroke_index);
  }

  computeRoundNetScore(): number {
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

  getRoundRelativeGrossScoreString(): string {
    return this.getRelativeScoreString(this.computeRoundGrossScore(), this.computeRoundPar());
  }

  getRoundRelativeAdjustedGrossScoreString(): string {
    return this.getRelativeScoreString(this.computeRoundAdjustedGrossScore(), this.computeRoundPar());
  }

  getRoundRelativeNetScoreString(): string {
    return this.getRelativeScoreString(this.computeRoundNetScore(), this.computeRoundPar());
  }

}
