import { Component, Input } from '@angular/core';

import { RoundData } from 'src/app/shared/round.model';

@Component({
  selector: 'app-match-scorecard-blank-score-line',
  templateUrl: './match-scorecard-blank-score-line.component.html',
  styleUrls: ['./match-scorecard-blank-score-line.component.css'],
  standalone: false,
})
export class MatchScorecardBlankScoreLineComponent {
  @Input() topTeamRound: RoundData;
  @Input() bottomTeamRound: RoundData;

  @Input() editMode = false;

  getNetScoreDifference(): number {
    const topTeamNetScore = this.topTeamRound.holes
      .map((hole) => hole.gross_score - hole.handicap_strokes)
      .reduce((prev, next) => prev + next);
    const bottomTeamNetScore = this.bottomTeamRound.holes
      .map((hole) => hole.gross_score - hole.handicap_strokes)
      .reduce((prev, next) => prev + next);
    return topTeamNetScore - bottomTeamNetScore;
  }
}
