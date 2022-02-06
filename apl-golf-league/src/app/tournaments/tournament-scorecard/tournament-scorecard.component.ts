import { Component, Input, OnInit } from '@angular/core';

import { RoundData } from '../../shared/round.model';

@Component({
  selector: 'app-tournament-scorecard',
  templateUrl: './tournament-scorecard.component.html',
  styleUrls: ['./tournament-scorecard.component.css']
})
export class TournamentScorecardComponent implements OnInit {
  @Input() rounds: RoundData[];
  scoreMode: string = "gross";

  roundIdx: number = 0;

  trackNames: string[] = [];
  frontRounds: RoundData[] = [];
  backRounds: RoundData[] = [];

  ngOnInit(): void {
    for (let round of this.rounds) {
      if (this.trackNames.indexOf(round.track_name) == -1) {
        this.trackNames.push(round.track_name);
      }
    }

    for (let round of this.rounds) {
      const idx = this.trackNames.indexOf(round.track_name);
      if (idx === 0) {
        this.frontRounds.push(round);
      } else {
        this.backRounds.push(round);
      }
    }
  }

  onScoreModeChanged(scoreMode: string): void {
    this.scoreMode = scoreMode;
  }

  getRoundSubtitle(round: RoundData): string {
    return round.tee_name + " - PH: " + round.golfer_playing_handicap.toFixed(0);
  }

}
