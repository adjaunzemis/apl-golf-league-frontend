import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ToggleButtonChangeEvent, ToggleButtonModule } from 'primeng/togglebutton';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';

import { RoundData } from 'src/app/shared/round.model';

@Component({
  selector: 'app-team-rounds',
  templateUrl: './team-rounds.component.html',
  styleUrl: './team-rounds.component.css',
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    ToggleButtonModule,
    SelectModule,
    InputTextModule,
  ],
})
export class TeamRoundsComponent implements OnInit {
  @Input() rounds!: RoundData[];

  golferNames!: string[];

  scoringMode = 'gross';
  labelScoringModeGross = 'Scoring Mode: Gross';
  labelScoringModeNet = 'Scoring Mode: Net';

  ngOnInit(): void {
    const roundGolferNames = this.rounds.map((round) => round.golfer_name);
    this.golferNames = [...new Set(roundGolferNames)];
    this.golferNames.push('');
  }

  onChangeScoringMode(event: ToggleButtonChangeEvent): void {
    if (event.checked) {
      this.scoringMode = 'net';
    } else {
      this.scoringMode = 'gross';
    }
  }

  getScoreForHole(round: RoundData, holeNum: number): number {
    if (this.scoringMode == 'net') {
      return round.holes[holeNum - 1].net_score;
    }
    if (this.scoringMode == 'adj_gross') {
      return round.holes[holeNum - 1].adjusted_gross_score;
    }
    return round.holes[holeNum - 1].gross_score;
  }

  isHoleScoreBelowPar(round: RoundData, holeNum: number): boolean {
    const score = this.getScoreForHole(round, holeNum);
    return score < round.holes[holeNum - 1].par;
  }

  isHoleScoreAbovePar(round: RoundData, holeNum: number): boolean {
    const score = this.getScoreForHole(round, holeNum);
    return score > round.holes[holeNum - 1].par;
  }

  isHoleScoreAtLeastTwoFromPar(round: RoundData, holeNum: number): boolean {
    const score = this.getScoreForHole(round, holeNum);
    return Math.abs(score - round.holes[holeNum - 1].par) > 1;
  }

  getRoundScore(round: RoundData): number {
    if (this.scoringMode == 'net') {
      return round.net_score;
    }
    if (this.scoringMode == 'adj_gross') {
      return round.adjusted_gross_score;
    }
    return round.gross_score;
  }

  getRoundScoreToPar(round: RoundData): string {
    const scoreToPar = this.getRoundScore(round) - round.tee_par;
    if (scoreToPar == 0) {
      return 'E';
    }
    if (scoreToPar > 0) {
      return '+' + scoreToPar;
    }
    return '' + scoreToPar;
  }

  isRoundScoreBelowPar(round: RoundData): boolean {
    return this.getRoundScore(round) < round.tee_par;
  }
}
