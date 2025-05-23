import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatchData } from '../../shared/match.model';
import { RoundData } from '../../shared/round.model';
import { ScorecardModule } from 'src/app/shared/scorecard/scorecard.module';
import { MatchScorecardScoreLineComponent } from './match-scorecard-score-line/match-scorecard-score-line.component';

@Component({
  selector: 'app-match-scorecard',
  templateUrl: './match-scorecard.component.html',
  styleUrls: ['./match-scorecard.component.css'],
  imports: [CommonModule, ScorecardModule, MatchScorecardScoreLineComponent],
})
export class MatchScorecardComponent implements OnInit, OnChanges {
  @Input() match: MatchData;
  @Input() topTeamId: number;
  bottomTeamId: number;

  scoreMode = 'gross';

  roundIdx = 0;

  ngOnInit(): void {
    this.setTopAndBottomTeamIds();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.topTeamId) {
      this.topTeamId = changes.topTeamId.currentValue;
    }
    this.setTopAndBottomTeamIds();
  }

  private setTopAndBottomTeamIds(): void {
    if (!this.topTeamId) {
      this.topTeamId = this.match.home_team_id;
    }
    this.bottomTeamId =
      this.topTeamId === this.match.home_team_id
        ? this.match.away_team_id
        : this.match.home_team_id;
  }

  getMatchTitle(): string {
    return this.match.rounds[0].course_name + ' - ' + this.match.rounds[0].track_name;
  }

  getMatchSubtitle(): string {
    return new Date(this.match.rounds[0].date_played).toLocaleDateString('en-us', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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
