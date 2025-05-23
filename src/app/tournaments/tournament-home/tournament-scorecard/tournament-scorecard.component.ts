import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TournamentInfo } from '../../../shared/tournament.model';
import { RoundData } from '../../../shared/round.model';
import { HoleResultData } from '../../../shared/hole-result.model';
import { ScorecardModule } from 'src/app/shared/scorecard/scorecard.module';

@Component({
  selector: 'app-tournament-scorecard',
  templateUrl: './tournament-scorecard.component.html',
  styleUrls: ['./tournament-scorecard.component.css'],
  imports: [CommonModule, ScorecardModule],
})
export class TournamentScorecardComponent implements OnInit, OnChanges {
  @Input() info: TournamentInfo;
  @Input() rounds: RoundData[];

  scoreMode = 'gross';

  roundIdx = 0;

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
    for (const round of this.rounds) {
      if (this.trackNames.indexOf(round.track_name) == -1) {
        this.trackNames.push(round.track_name);
      }
    }
  }

  private sortRoundsByTrack(): void {
    this.frontRounds = [];
    this.backRounds = [];
    for (const round of this.rounds) {
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
    return new Date(this.rounds[0].date_played).toLocaleDateString('en-us', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getRoundTitle(round: RoundData): string {
    if (this.info.scramble) {
      return 'Scramble';
    } else {
      return round.golfer_name;
    }
  }

  getRoundSubtitle(round: RoundData): string {
    return (
      round.tee_name +
      ' - Hcp: ' +
      (round.golfer_playing_handicap ? round.golfer_playing_handicap.toFixed(0) : '--')
    );
  }

  getTeamRoundTitle(): string {
    // TODO: Implement for other modes
    if (this.info.scramble) {
      return 'Scramble';
    } else if (this.info.bestball > 1) {
      return `${this.info.bestball} Best Balls`;
    } else {
      return 'Best Ball';
    }
  }

  getTeamRoundFrontSubtitle(): string {
    if (this.info.scramble) {
      return `${this.scoreMode} - Hcp: ${this.frontRounds[0].golfer_playing_handicap ? this.frontRounds[0].golfer_playing_handicap.toFixed(0) : '--'}`;
    } else {
      return `${this.scoreMode}`;
    }
  }

  getTeamRoundBackSubtitle(): string {
    if (this.info.scramble) {
      return `${this.scoreMode} - Hcp: ${this.backRounds[0].golfer_playing_handicap ? this.backRounds[0].golfer_playing_handicap.toFixed(0) : '--'}`;
    } else {
      return `${this.scoreMode}`;
    }
  }

  getTeamRoundFront(): RoundData {
    const teamFirstRound = this.frontRounds[0]; // TODO: Select team round info more intelligently, impacts scramble scoring?
    const playingHandicap = this.info.scramble ? teamFirstRound.golfer_playing_handicap : undefined;
    const teamRound: RoundData = {
      round_id: -1, // TODO: remove placeholder?
      team_id: teamFirstRound.team_id,
      date_played: this.info.date,
      round_type: 'Tournament',
      golfer_id: -1, // TODO: remove placeholder?
      golfer_name: teamFirstRound.team_name ? teamFirstRound.team_name : 'n/a',
      golfer_playing_handicap: playingHandicap,
      team_name: teamFirstRound.team_name,
      course_id: teamFirstRound.course_id,
      course_name: this.info.course,
      track_id: teamFirstRound.track_id,
      track_name: teamFirstRound.track_name,
      tee_id: teamFirstRound.tee_id, // TODO: Select tee-id more intelligently for team round, impacts scramble scoring?
      tee_name: teamFirstRound.tee_name,
      tee_gender: teamFirstRound.tee_gender,
      tee_rating: teamFirstRound.tee_rating,
      tee_slope: teamFirstRound.tee_slope,
      tee_par:
        this.info.bestball > 0
          ? this.info.bestball * teamFirstRound.tee_par
          : teamFirstRound.tee_par,
      tee_color: teamFirstRound.tee_color,
      gross_score: 0, // TODO: remove placeholder?
      adjusted_gross_score: 0, // TODO: remove placeholder?
      net_score: 0, // TODO: remove placeholder?
      holes: this.createHoleResultDataForTeam(this.frontRounds, playingHandicap),
    };
    return teamRound;
  }

  getTeamRoundBack(): RoundData {
    const teamFirstRound = this.backRounds[0]; // TODO: Select team round info more intelligently, impacts scramble scoring?
    const playingHandicap = this.info.scramble ? teamFirstRound.golfer_playing_handicap : undefined;
    const teamRound: RoundData = {
      round_id: -1, // TODO: remove placeholder?
      team_id: teamFirstRound.team_id,
      date_played: this.info.date,
      round_type: 'Tournament',
      golfer_id: -1, // TODO: remove placeholder?
      golfer_name: teamFirstRound.team_name ? teamFirstRound.team_name : 'n/a',
      golfer_playing_handicap: playingHandicap,
      team_name: teamFirstRound.team_name,
      course_id: teamFirstRound.course_id,
      course_name: this.info.course,
      track_id: teamFirstRound.track_id,
      track_name: teamFirstRound.track_name,
      tee_id: teamFirstRound.tee_id, // TODO: Select tee-id more intelligently for team round, impacts scramble scoring?
      tee_name: teamFirstRound.tee_name,
      tee_gender: teamFirstRound.tee_gender,
      tee_rating: teamFirstRound.tee_rating,
      tee_slope: teamFirstRound.tee_slope,
      tee_par:
        this.info.bestball > 0
          ? this.info.bestball * teamFirstRound.tee_par
          : teamFirstRound.tee_par,
      tee_color: teamFirstRound.tee_color,
      gross_score: 0, // TODO: remove placeholder?
      adjusted_gross_score: 0, // TODO: remove placeholder?
      net_score: 0, // TODO: remove placeholder?
      holes: this.createHoleResultDataForTeam(this.backRounds, playingHandicap),
    };
    return teamRound;
  }

  private createHoleResultDataForTeam(
    rounds: RoundData[],
    playingHandicap: number | undefined,
  ): HoleResultData[] {
    const holeResultData: HoleResultData[] = [];
    for (let holeIdx = 0; holeIdx < rounds[0].holes.length; holeIdx++) {
      const hole = rounds[0].holes[holeIdx];

      let holePar = hole.par;
      let grossScore = 99;
      let netScore = 99;
      if (this.info.bestball === 2) {
        holePar = hole.par * 2;
        const grossScores = [99, 99];
        const netScores = [99, 99];
        for (const round of rounds) {
          const handicapStrokes = this.computeHandicapStrokes(
            hole.stroke_index,
            round.golfer_playing_handicap,
          );
          if (round.holes[holeIdx].gross_score < grossScores[1]) {
            if (round.holes[holeIdx].gross_score < grossScores[0]) {
              grossScores[1] = grossScores[0];
              grossScores[0] = round.holes[holeIdx].gross_score;
            } else {
              grossScores[1] = round.holes[holeIdx].gross_score;
            }
          }
          if (round.holes[holeIdx].gross_score - handicapStrokes < netScores[1]) {
            if (round.holes[holeIdx].gross_score - handicapStrokes < netScores[0]) {
              netScores[1] = netScores[0];
              netScores[0] = round.holes[holeIdx].gross_score - handicapStrokes;
            } else {
              netScores[1] = round.holes[holeIdx].gross_score - handicapStrokes;
            }
          }
        }
        grossScore = grossScores[0] + grossScores[1];
        netScore = netScores[0] + netScores[1];
      } else {
        grossScore = 99;
        netScore = 99;
        for (const round of rounds) {
          const handicapStrokes = this.computeHandicapStrokes(
            hole.stroke_index,
            round.golfer_playing_handicap,
          );
          grossScore = Math.min(grossScore, round.holes[holeIdx].gross_score);
          netScore = Math.min(netScore, round.holes[holeIdx].gross_score - handicapStrokes);
        }
      }

      holeResultData.push({
        hole_result_id: -1, // TODO: remove placeholder?
        round_id: -1, // TODO: remove placeholder?
        tee_id: hole.tee_id,
        hole_id: hole.hole_id,
        number: hole.number,
        par: holePar,
        yardage: hole.yardage,
        stroke_index: hole.stroke_index,
        handicap_strokes: this.computeHandicapStrokes(hole.stroke_index, playingHandicap),
        gross_score: grossScore,
        adjusted_gross_score: 0, // TODO: remove placeholder?
        net_score: netScore,
      });
    }
    return holeResultData;
  }

  private computeHandicapStrokes(strokeIndex: number, playingHandicap: number | undefined): number {
    if (playingHandicap === undefined) {
      return 0;
    }
    if (playingHandicap < 0) {
      // plus-handicap
      return -playingHandicap * 2 > 18 - strokeIndex ? -1 : 0;
    }
    return (
      Math.floor((playingHandicap * 2) / 18) + ((playingHandicap * 2) % 18 >= strokeIndex ? 1 : 0)
    );
  }
}
