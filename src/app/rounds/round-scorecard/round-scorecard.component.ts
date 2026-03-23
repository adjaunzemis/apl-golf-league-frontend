import { Component, Input } from '@angular/core';

import { RoundData } from 'src/app/shared/round.model';
import { ScoreMode } from 'src/app/shared/score-mode.model';

@Component({
  selector: 'app-round-scorecard',
  templateUrl: './round-scorecard.component.html',
  styleUrls: ['./round-scorecard.component.css'],
  standalone: false,
})
export class RoundScorecardComponent {
  @Input() round: RoundData;
  scoreMode = ScoreMode.GROSS;

  onScoreModeChanged(scoreMode: string): void {
    this.scoreMode = scoreMode;
  }
}
