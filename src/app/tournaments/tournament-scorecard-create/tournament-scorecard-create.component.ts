import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SelectModule, SelectChangeEvent } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';

import { TournamentsService } from '../tournaments.service';
import { SeasonsService } from '../../seasons/seasons.service';
import { CoursesService } from '../../courses/courses.service';
import {
  TournamentData,
  TournamentInfo,
  TournamentTeam,
  TournamentTeamGolfer,
} from '../../shared/tournament.model';
import { DivisionData } from '../../shared/division.model';
import { RoundData } from '../../shared/round.model';
import { Course } from '../../shared/course.model';
import { Tee } from '../../shared/tee.model';
import { ScorecardModule } from '../../shared/scorecard/scorecard.module';
import { TournamentInput } from '../../shared/match.model';

@Component({
  selector: 'app-tournament-scorecard-create',
  templateUrl: './tournament-scorecard-create.component.html',
  styleUrls: ['./tournament-scorecard-create.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SelectModule,
    ButtonModule,
    ProgressSpinnerModule,
    ScorecardModule,
  ],
})
export class TournamentScorecardCreateComponent implements OnInit, OnDestroy {
  private tournamentsService = inject(TournamentsService);
  private seasonsService = inject(SeasonsService);
  private coursesService = inject(CoursesService);
  private messageService = inject(MessageService);

  isLoading = false;
  isSubmitting = false;

  tournaments: TournamentInfo[] = [];
  selectedTournamentInfo: TournamentInfo | null = null;
  selectedTournamentData: TournamentData | null = null;

  teams: TournamentTeam[] = [];
  selectedTeam: TournamentTeam | null = null;

  course: Course | null = null;

  rounds: RoundData[] = [];

  private subscriptions = new Subscription();

  ngOnInit(): void {
    this.isLoading = true;
    this.subscriptions.add(
      this.seasonsService.getActiveSeason().subscribe((season) => {
        this.tournamentsService.getList(season.year);
      }),
    );

    this.subscriptions.add(
      this.tournamentsService.getListUpdateListener().subscribe((list) => {
        this.tournaments = list;
        this.isLoading = false;
      }),
    );

    this.subscriptions.add(
      this.tournamentsService.getTournamentUpdateListener().subscribe((data) => {
        this.selectedTournamentData = data;
        if (data.course_id) {
          this.coursesService.getCourse(data.course_id);
        }
      }),
    );

    this.subscriptions.add(
      this.tournamentsService.getTeamsUpdateListener().subscribe((teams) => {
        this.teams = teams;
        this.isLoading = false;
      }),
    );

    this.subscriptions.add(
      this.coursesService.getSelectedCourseUpdateListener().subscribe((course) => {
        this.course = course;
        this.isLoading = false;
        if (this.selectedTeam) {
          this.initializeRounds();
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onTournamentChange(event: SelectChangeEvent): void {
    this.selectedTournamentInfo = event.value;
    this.selectedTournamentData = null;
    this.selectedTeam = null;
    this.rounds = [];
    if (this.selectedTournamentInfo) {
      this.isLoading = true;
      this.tournamentsService.getTournament(this.selectedTournamentInfo.id);
      this.tournamentsService.getTeams(this.selectedTournamentInfo.id);
    }
  }

  onTeamChange(event: SelectChangeEvent): void {
    this.selectedTeam = event.value;
    if (this.selectedTeam && this.course) {
      this.initializeRounds();
    } else {
      this.rounds = [];
    }
  }

  private initializeRounds(): void {
    if (!this.selectedTeam || !this.course || !this.selectedTournamentData) return;

    this.rounds = [];
    for (const golfer of this.selectedTeam.golfers) {
      const division = this.selectedTournamentData.divisions.find(
        (d) => d.name === golfer.division,
      );
      if (division) {
        // Primary Round
        const primaryRound = this.createRound(golfer, division, true);
        if (primaryRound) {
          this.rounds.push(primaryRound);
        }

        // Secondary Round (if 18 holes)
        if (division.secondary_track_id) {
          const secondaryRound = this.createRound(golfer, division, false);
          if (secondaryRound) {
            this.rounds.push(secondaryRound);
          }
        }
      }
    }
  }

  private createRound(
    golfer: TournamentTeamGolfer,
    division: DivisionData,
    isPrimary: boolean,
  ): RoundData | null {
    if (!this.course) return null;

    const trackId = isPrimary ? division.primary_track_id : division.secondary_track_id;
    const teeId = isPrimary ? division.primary_tee_id : division.secondary_tee_id;

    const track = this.course.tracks.find((t) => t.id === trackId);
    if (!track) return null;

    const tee = track.tees.find((t) => t.id === teeId);
    if (!tee) return null;

    const playingHandicap = this.computePlayingHandicap(golfer, tee);

    const round: RoundData = {
      round_id: -1,
      date_played: this.selectedTournamentData!.date,
      round_type: 'Tournament',
      golfer_id: golfer.golfer_id,
      golfer_name: golfer.name,
      golfer_playing_handicap: playingHandicap,
      team_id: this.selectedTeam!.team_id,
      team_name: this.selectedTeam!.name,
      course_id: this.course.id,
      course_name: this.course.name,
      track_id: track.id,
      track_name: track.name,
      tee_id: tee.id,
      tee_name: tee.name,
      tee_gender: tee.gender,
      tee_rating: tee.rating,
      tee_slope: tee.slope,
      tee_par: this.computeTeePar(tee),
      tee_color: tee.color,
      gross_score: 0,
      adjusted_gross_score: 0,
      net_score: 0,
      holes: tee.holes.map((hole) => ({
        hole_result_id: -1,
        round_id: -1,
        tee_id: tee.id,
        hole_id: hole.id,
        number: hole.number,
        par: hole.par,
        yardage: hole.yardage,
        stroke_index: hole.stroke_index,
        handicap_strokes: this.computeHandicapStrokes(hole.stroke_index, playingHandicap),
        gross_score: 0,
        adjusted_gross_score: 0,
        net_score: 0,
      })),
    };

    return round;
  }

  private computePlayingHandicap(golfer: TournamentTeamGolfer, tee: Tee): number | undefined {
    if (golfer.handicap_index === undefined) return undefined;
    return Math.round(
      golfer.handicap_index * (tee.slope / 113.0) + (tee.rating - this.computeTeePar(tee)),
    );
  }

  private computeTeePar(tee: Tee): number {
    return tee.holes.reduce((sum, hole) => sum + hole.par, 0);
  }

  private computeHandicapStrokes(strokeIndex: number, playingHandicap: number | undefined): number {
    if (playingHandicap === undefined) return 0;
    if (playingHandicap < 0) {
      return -playingHandicap * 2 > 18 - strokeIndex ? -1 : 0;
    }
    return Math.floor((playingHandicap * 2) / 18) + ((playingHandicap * 2) % 18 >= strokeIndex ? 1 : 0);
  }

  onSubmit(): void {
    if (!this.selectedTournamentData || this.rounds.length === 0) return;

    if (!this.isValid()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please enter valid scores for all holes.',
      });
      return;
    }

    const tournamentInput: TournamentInput = {
      tournament_id: this.selectedTournamentData.id,
      date_played: this.selectedTournamentData.date,
      rounds: this.rounds.map((round) => ({
        team_id: round.team_id!,
        golfer_id: round.golfer_id,
        golfer_playing_handicap: round.golfer_playing_handicap,
        course_id: round.course_id,
        track_id: round.track_id,
        tee_id: round.tee_id,
        holes: round.holes.map((h) => ({
          hole_id: h.hole_id,
          gross_score: h.gross_score,
        })),
      })),
    };

    this.isSubmitting = true;
    this.tournamentsService.postRounds(tournamentInput).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Scores posted successfully!',
        });
        this.selectedTeam = null;
        this.rounds = [];
      },
      error: (err) => {
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to post scores. ' + (err.error?.detail || err.message),
        });
      },
    });
  }

  isValid(): boolean {
    return this.rounds.every((round) =>
      round.holes.every((hole) => hole.gross_score >= 1 && hole.gross_score <= 15),
    );
  }

  getGolferRounds(golferId: number): RoundData[] {
    return this.rounds.filter((r) => r.golfer_id === golferId);
  }
}
