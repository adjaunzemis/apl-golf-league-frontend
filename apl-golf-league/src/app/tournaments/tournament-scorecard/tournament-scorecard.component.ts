import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { TournamentInfo } from '../../shared/tournament.model';
import { RoundData } from '../../shared/round.model';

@Component({
  selector: 'app-tournament-scorecard',
  templateUrl: './tournament-scorecard.component.html',
  styleUrls: ['./tournament-scorecard.component.css']
})
export class TournamentScorecardComponent implements OnInit, OnChanges {
  @Input() tournament: TournamentInfo;
  @Input() rounds: RoundData[];
  scoreMode: string = "gross";

  roundIdx: number = 0;

  trackNames: string[] = [];
  frontRounds: RoundData[] = [];
  backRounds: RoundData[] = [];

  ngOnInit(): void {
    this.getTrackNames();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.rounds) {
      this.getTrackNames();
      this.sortRoundsByTrack();
    }
  }

  private getTrackNames(): void {
    for (let round of this.rounds) {
      if (this.trackNames.indexOf(round.track_name) == -1) {
        this.trackNames.push(round.track_name);
      }
    }
  }

  private sortRoundsByTrack(): void {
    this.frontRounds = [];
    this.backRounds = [];
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

  getTournamentTitle(): string {
    return this.rounds[0].course_name;
  }

  getTournamentSubtitle(): string {
    return new Date(this.rounds[0].date_played).toLocaleDateString('en-us', { weekday: "long", year:"numeric", month:"long", day:"numeric"});
  }

  getRoundSubtitle(round: RoundData): string {
    return round.tee_name + " - Hcp: " + (round.golfer_playing_handicap ? round.golfer_playing_handicap.toFixed(0) : '--');
  }

}
