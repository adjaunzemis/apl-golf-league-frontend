import { Component, Input, OnChanges, OnInit } from "@angular/core";

import { MatchData } from "src/app/shared/match.model";
import { RoundData } from "src/app/shared/round.model";

@Component({
  selector: "app-match-scorecard-blank-score-line",
  templateUrl: "./match-scorecard-blank-score-line.component.html",
  styleUrls: ["./match-scorecard-blank-score-line.component.css"]
})
export class MatchScorecardBlankScoreLineComponent implements OnInit, OnChanges {
  // @Input() match: MatchData;

  // @Input() topTeamId: number;
  // @Input() bottomTeamId: number;

  // topTeamRounds: RoundData[];
  // bottomTeamRounds: RoundData[];

  // topTeamHoleNetScores: number[];
  // bottomTeamHoleNetScores: number[];

  // winningTeamId: number;

  ngOnInit(): void {
    // this.separateRoundsByTeam();
    // this.computeHoleNetScores();
    // this.setWinningTeamId();
  }

  ngOnChanges(): void {
    // this.ngOnInit();
  }

  // private separateRoundsByTeam() {
  //   this.topTeamRounds = [];
  //   this.bottomTeamRounds = [];
  //   for (let round of this.match.rounds) {
  //     if (round.team_id === this.topTeamId) {
  //       this.topTeamRounds.push(round);
  //     } else if (round.team_id === this.bottomTeamId) {
  //       this.bottomTeamRounds.push(round);
  //     }
  //   }
  // }

  // private computeHoleNetScores() {
  //   this.topTeamHoleNetScores = [];
  //   this.bottomTeamHoleNetScores = [];
  //   for (let holeIdx = 0; holeIdx < this.match.rounds[0].holes.length; holeIdx++) {
  //     this.topTeamHoleNetScores[holeIdx] = 0;
  //     for (let round of this.topTeamRounds) {
  //       this.topTeamHoleNetScores[holeIdx] += round.holes[holeIdx].net_score;
  //     }
  //     this.bottomTeamHoleNetScores[holeIdx] = 0;
  //     for (let round of this.bottomTeamRounds) {
  //       this.bottomTeamHoleNetScores[holeIdx] += round.holes[holeIdx].net_score;
  //     }
  //   }
  // }

  // private setWinningTeamId(): void {
  //   let topTeamTotalNetScore = this.topTeamHoleNetScores.reduce(function(prev: number, cur: number) {
  //     return prev + cur;
  //   }, 0);
  //   let bottomTeamTotalNetScore = this.bottomTeamHoleNetScores.reduce(function(prev: number, cur: number) {
  //     return prev + cur;
  //   }, 0);
  //   this.winningTeamId = topTeamTotalNetScore < bottomTeamTotalNetScore ? this.topTeamId : bottomTeamTotalNetScore < topTeamTotalNetScore ? this.bottomTeamId : -1;
  // }
}
