import { Component, EventEmitter, Input, Output } from "@angular/core";

import { HoleResultData } from "../../hole-result.model";
import { RoundData } from "../../round.model";

@Component({
    selector: "app-scorecard-score-line",
    templateUrl: "./scorecard-score-line.component.html",
    styleUrls: ["./scorecard-score-line.component.css"],
    standalone: false
})
export class ScorecardScoreLineComponent {
  @Input() round: RoundData;
  @Output() roundChange = new EventEmitter<RoundData>();

  @Input() scoreMode: string = "gross";

  @Input() title: string;
  @Input() subtitle: string;
  @Input() linkToGolferHome: boolean = false;

  @Input() showScores: boolean = true;
  @Input() enterScores: boolean = false;
  @Input() teamScore: boolean = false;
  @Input() editHandicap: boolean = false;

  onHoleScoreChanged(): void {
    this.roundChange.emit(this.round);
  }

  onGolferHandicapChanged(): void {
    for (let hole of this.round.holes) {
      hole.handicap_strokes = this.computeHandicapStrokes(hole.stroke_index, this.round.golfer_playing_handicap);
    }
    this.roundChange.emit(this.round);
  }

  getRoundScore(): number {
    if (this.scoreMode === "adjusted gross") {
      return this.round.holes.map(hole => hole.adjusted_gross_score).reduce((prev, next) => prev + next);
    } else if (this.scoreMode === "net") {
      return this.round.holes.map(hole => hole.net_score).reduce((prev, next) => prev + next);
    } else {
      return this.round.holes.map(hole => hole.gross_score).reduce((prev, next) => prev + next);
    }
  }

  getHoleScore(hole: HoleResultData): number {
    if (this.scoreMode === "adjusted gross") {
      return hole.adjusted_gross_score;
    } else if (this.scoreMode === "net") {
      return hole.net_score;
    } else {
      return hole.gross_score;
    }
  }

  getHoleRelativeScore(hole: HoleResultData): number {
    return this.getHoleScore(hole) - hole.par;
  }

  getRelativeScoreString(): string {
    const relativeScore = this.getRoundScore() - this.round.tee_par;
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

  private computeHandicapStrokes(strokeIndex: number, playingHandicap: number | undefined): number {
    if (playingHandicap === undefined) {
      return 0;
    }
    if (playingHandicap < 0) { // plus-handicap
      return (-playingHandicap * 2) > (18 - strokeIndex) ? -1 : 0;
    }
    return Math.floor((playingHandicap * 2) / 18) + ((playingHandicap * 2) % 18 >= strokeIndex ? 1 : 0);
  }

}
