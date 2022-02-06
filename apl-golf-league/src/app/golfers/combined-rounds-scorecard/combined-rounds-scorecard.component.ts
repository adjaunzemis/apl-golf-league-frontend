import { Component, Input } from '@angular/core';

import { RoundData } from '../../shared/round.model';

@Component({
  selector: 'app-combined-rounds-scorecard',
  templateUrl: './combined-rounds-scorecard.component.html',
  styleUrls: ['./combined-rounds-scorecard.component.css']
})
export class CombinedRoundsScorecardComponent {
  @Input() rounds: RoundData[];

  scoreMode: string = "gross";

  getScorecardTitle(round: RoundData): string {
    return round.course_name + " - " + round.track_name
  }

  getScorecardSubtitle(round: RoundData): string {
    return round.tee_name + ": Par " + round.tee_par.toFixed(0) + " (" + round.tee_rating.toFixed(1) + "/" + round.tee_slope.toFixed(0) + ")";
  }

  getRoundTitle(round: RoundData): string {
    return round.date_played.toString();
  }

  getRoundSubtitle(round: RoundData): string {
    return round.tee_name + " - PH: " + round.golfer_playing_handicap.toFixed(0);
  }

}
