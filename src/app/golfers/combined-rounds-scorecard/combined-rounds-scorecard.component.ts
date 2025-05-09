import { Component, Input } from '@angular/core';

import { RoundData } from '../../shared/round.model';

@Component({
  selector: 'app-combined-rounds-scorecard',
  templateUrl: './combined-rounds-scorecard.component.html',
  styleUrls: ['./combined-rounds-scorecard.component.css'],
  standalone: false,
})
export class CombinedRoundsScorecardComponent {
  @Input() rounds: RoundData[];

  scoreMode = 'gross';

  getScorecardTitle(round: RoundData): string {
    return round.course_name + ' - ' + round.track_name;
  }

  getScorecardSubtitle(round: RoundData): string {
    return (
      round.tee_name +
      ': Par ' +
      round.tee_par.toFixed(0) +
      ' (' +
      round.tee_rating.toFixed(1) +
      '/' +
      round.tee_slope.toFixed(0) +
      ')'
    );
  }

  getRoundTitle(round: RoundData): string {
    return new Date(round.date_played).toLocaleDateString('en-us', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  getRoundSubtitle(round: RoundData): string {
    return (
      round.tee_name +
      ' - Hcp: ' +
      (round.golfer_playing_handicap ? round.golfer_playing_handicap.toFixed(0) : '--')
    );
  }
}
