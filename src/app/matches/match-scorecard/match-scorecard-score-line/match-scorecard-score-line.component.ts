import { Component, Input, OnChanges, OnInit } from "@angular/core";

import { MatchData } from "src/app/shared/match.model";
import { RoundData } from "src/app/shared/round.model";

@Component({
    selector: "app-match-scorecard-score-line",
    templateUrl: "./match-scorecard-score-line.component.html",
    styleUrls: ["./match-scorecard-score-line.component.css"],
    standalone: false
})
export class MatchScorecardScoreLineComponent implements OnInit, OnChanges {
  @Input() match: MatchData;

  @Input() topTeamId: number;
  @Input() bottomTeamId: number;

  topTeamRounds: RoundData[];
  bottomTeamRounds: RoundData[];

  topTeamHoleNetScores: number[];
  bottomTeamHoleNetScores: number[];

  holeWinningTeamIds: number[];

  winningTeamId: number;

  ngOnInit(): void {
    this.separateRoundsByTeam();
    this.computeHoleNetScores();
    this.setHoleWinningTeamIds();
    this.setWinningTeamId();
  }

  ngOnChanges(): void {
    this.ngOnInit();
  }

  private separateRoundsByTeam() {
    this.topTeamRounds = [];
    this.bottomTeamRounds = [];
    for (let round of this.match.rounds) {
      if (round.team_id === this.topTeamId) {
        this.topTeamRounds.push(round);
      } else if (round.team_id === this.bottomTeamId) {
        this.bottomTeamRounds.push(round);
      }
    }
  }

  private computeHoleNetScores() {
    this.topTeamHoleNetScores = [];
    this.bottomTeamHoleNetScores = [];
    for (let holeIdx = 0; holeIdx < this.match.rounds[0].holes.length; holeIdx++) {
      this.topTeamHoleNetScores[holeIdx] = 0;
      for (let round of this.topTeamRounds) {
        this.topTeamHoleNetScores[holeIdx] += round.holes[holeIdx].net_score;
      }
      this.bottomTeamHoleNetScores[holeIdx] = 0;
      for (let round of this.bottomTeamRounds) {
        this.bottomTeamHoleNetScores[holeIdx] += round.holes[holeIdx].net_score;
      }
    }
  }

  private setHoleWinningTeamIds(): void {
    this.holeWinningTeamIds = [];

    // Compute team handicap stroke differential
    let topTeamHandicap = 0;
    for (const round of this.topTeamRounds) {
      if (round.golfer_playing_handicap) {
        topTeamHandicap += round.golfer_playing_handicap;
      }
    }

    let bottomTeamHandicap = 0;
    for (const round of this.bottomTeamRounds) {
      if (round.golfer_playing_handicap) {
        bottomTeamHandicap += round.golfer_playing_handicap;
      }
    }

    const teamHandicapDiff = topTeamHandicap - bottomTeamHandicap;
    const teamHandicapRem = Math.abs(teamHandicapDiff) % 9;

    const baseHandicapStrokes = Math.sign(teamHandicapDiff) * Math.floor(Math.abs(teamHandicapDiff / 9.0));

    // Determine hole winners
    // Compare team gross scores, accounting for team handicap stroke adjustment
    for (let holeIdx = 0; holeIdx < this.match.rounds[0].holes.length; holeIdx++) {
      let holeStrokeIndex = this.match.rounds[0].holes[holeIdx].stroke_index;
      if (holeStrokeIndex % 2 === 1) { // odd stroke index holes
        holeStrokeIndex += 1; // make even, will divide by 2
      }
      holeStrokeIndex /= 2; // effective stroke index for 9-hole handicapping

      let holeHandicapStrokes = baseHandicapStrokes;
      if (holeStrokeIndex <= teamHandicapRem) {
        holeHandicapStrokes += Math.sign(teamHandicapDiff);
      }

      let topTeamHoleNetScore = 0;
      for (const round of this.topTeamRounds) {
        topTeamHoleNetScore += round.holes[holeIdx].gross_score;
      }

      let bottomTeamHoleScore = 0;
      for (const round of this.bottomTeamRounds) {
        bottomTeamHoleScore += round.holes[holeIdx].gross_score;
      }

      const holeScoreDiff = topTeamHoleNetScore - holeHandicapStrokes - bottomTeamHoleScore;
      this.holeWinningTeamIds[holeIdx] = -1;
      if (holeScoreDiff < 0) {
        this.holeWinningTeamIds[holeIdx] = this.topTeamId;
      } else if (holeScoreDiff > 0) {
        this.holeWinningTeamIds[holeIdx] = this.bottomTeamId;
      }
    }
  }

  private setWinningTeamId(): void {
    let topTeamTotalNetScore = this.topTeamHoleNetScores.reduce(function(prev: number, cur: number) {
      return prev + cur;
    }, 0);
    let bottomTeamTotalNetScore = this.bottomTeamHoleNetScores.reduce(function(prev: number, cur: number) {
      return prev + cur;
    }, 0);
    this.winningTeamId = topTeamTotalNetScore < bottomTeamTotalNetScore ? this.topTeamId : bottomTeamTotalNetScore < topTeamTotalNetScore ? this.bottomTeamId : -1;
  }
}
