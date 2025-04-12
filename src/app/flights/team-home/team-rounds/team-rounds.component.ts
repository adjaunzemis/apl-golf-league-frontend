import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';

import { RoundData } from 'src/app/shared/round.model';

@Component({
  selector: 'app-team-rounds',
  templateUrl: './team-rounds.component.html',
  styleUrl: './team-rounds.component.css',
  imports: [CommonModule, CardModule, TableModule],
})
export class TeamRoundsComponent {
  @Input() rounds!: RoundData[];

  scoreMode = 'gross';

  getScoreForHole(round: RoundData, holeNum: number): number {
    if (this.scoreMode == 'net') {
      return round.holes[holeNum - 1].net_score;
    }
    if (this.scoreMode == 'adj_gross') {
      return round.holes[holeNum - 1].adjusted_gross_score;
    }
    return round.holes[holeNum - 1].gross_score;
  }

  isScoreCircled(round: RoundData, holeNum: number): boolean {
    const score = this.getScoreForHole(round, holeNum);
    return score < round.holes[holeNum - 1].par;
  }

  isScoreBoxed(round: RoundData, holeNum: number): boolean {
    const score = this.getScoreForHole(round, holeNum);
    return score > round.holes[holeNum - 1].par;
  }

  isScoreCrosshatched(round: RoundData, holeNum: number): boolean {
    const score = this.getScoreForHole(round, holeNum);
    return Math.abs(score - round.holes[holeNum - 1].par) > 1;
  }

  getRoundTotalScore(round: RoundData): number {
    if (this.scoreMode == 'net') {
      return round.net_score;
    }
    if (this.scoreMode == 'adj_gross') {
      return round.adjusted_gross_score;
    }
    return round.gross_score;
  }
}
