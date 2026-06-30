import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SelectModule, SelectChangeEvent } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';

import { TournamentsService } from '../tournaments.service';
import { SeasonsService } from '../../seasons/seasons.service';
import { CoursesService } from '../../courses/courses.service';
import {
  TournamentTeamGolfer,
  TournamentTeam,
  TournamentInfo,
  TournamentData,
} from '../../shared/tournament.model';
import { DivisionData } from '../../shared/division.model';
import { RoundData } from '../../shared/round.model';
import { HoleResultData } from '../../shared/hole-result.model';
import { Course } from '../../shared/course.model';
import { Tee } from '../../shared/tee.model';
import { Season } from '../../shared/season.model';
import { ScorecardModule } from '../../shared/scorecard/scorecard.module';
import { TournamentInput, RoundInput } from '../../shared/match.model';

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
    CardModule,
    TagModule,
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
  isReadOnly = false;

  seasons: Season[] = [];
  selectedSeason: Season | null = null;

  tournaments: TournamentInfo[] = [];
  selectedTournamentInfo: TournamentInfo | null = null;
  selectedTournamentData: TournamentData | null = null;

  teams: TournamentTeam[] = [];
  selectedTeam: TournamentTeam | null = null;

  course: Course | null = null;

  rounds: RoundData[] = [];
  teamRounds = new Map<number, RoundData>();

  private subscriptions = new Subscription();

  get uniqueTrackIds(): number[] {
    return Array.from(new Set(this.rounds.map((r) => r.track_id)));
  }

  getTrackName(trackId: number): string {
    return this.rounds.find((r) => r.track_id === trackId)?.track_name || 'Track';
  }

  getRoundsForTrack(trackId: number): RoundData[] {
    return this.rounds.filter((r) => r.track_id === trackId);
  }

  ngOnInit(): void {
    this.isLoading = true;

    this.subscriptions.add(
      this.seasonsService.getSeasons().subscribe((seasons) => {
        this.seasons = seasons;
      }),
    );

    this.subscriptions.add(
      this.seasonsService.getActiveSeason().subscribe((season) => {
        this.selectedSeason = season;
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

        // Map teams from TournamentData (TournamentTeamData[]) to our local format (TournamentTeam[])
        if (data.teams) {
          this.teams = data.teams.map((ttd) => ({
            tournament_id: ttd.tournament_id,
            team_id: ttd.id,
            name: ttd.name,
            golfers: ttd.golfers.map((g) => ({
              golfer_id: g.golfer_id,
              name: g.golfer_name,
              role: g.role,
              division: g.division_name,
              handicap_index: g.handicap_index,
              email: g.golfer_email,
            })),
            rounds: ttd.rounds,
          }));
        }
        this.isLoading = false;
        if (this.selectedTeam) {
          // Refresh selection if it was already selected
          const updatedTeam = this.teams.find((t) => t.team_id === this.selectedTeam?.team_id);
          if (updatedTeam) {
            this.selectedTeam = updatedTeam;
            this.initializeRounds();
          }
        }
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

  onSeasonChange(event: SelectChangeEvent): void {
    this.selectedSeason = event.value;
    this.clearTournamentSelection();
    if (this.selectedSeason) {
      this.isLoading = true;
      this.tournamentsService.getList(this.selectedSeason.year);
    } else {
      this.tournaments = [];
    }
  }

  onTournamentChange(event: SelectChangeEvent): void {
    this.selectedTournamentInfo = event.value;
    this.clearTeamSelection();
    if (this.selectedTournamentInfo) {
      this.isLoading = true;
      this.tournamentsService.getTournament(this.selectedTournamentInfo.id);
    }
  }

  onTeamChange(event: SelectChangeEvent): void {
    this.selectedTeam = event.value;
    if (this.selectedTeam && this.course) {
      this.initializeRounds();
    } else {
      this.rounds = [];
      this.teamRounds.clear();
    }
  }

  private clearTournamentSelection(): void {
    this.selectedTournamentInfo = null;
    this.selectedTournamentData = null;
    this.clearTeamSelection();
  }

  private clearTeamSelection(): void {
    this.selectedTeam = null;
    this.rounds = [];
    this.teamRounds.clear();
  }

  private initializeRounds(): void {
    if (!this.selectedTeam || !this.course || !this.selectedTournamentData) return;

    if (this.selectedTeam.rounds && this.selectedTeam.rounds.length > 0) {
      this.isReadOnly = true;
      if (this.selectedTournamentData.scramble) {
        // Scramble: Only show the rounds for the first golfer to avoid duplicate rows in UI
        const firstRoundGolferId = this.selectedTeam.rounds[0].golfer_id;
        this.rounds = this.selectedTeam.rounds
          .filter((r) => r.golfer_id === firstRoundGolferId)
          .map((r) => {
            const round = this.ensureHandicapStrokes(r);
            round.golfer_name = this.selectedTeam!.name; // Display team name
            return round;
          });
      } else {
        this.rounds = this.selectedTeam.rounds.map((r) => this.ensureHandicapStrokes(r));
      }
    } else {
      this.isReadOnly = false;
      this.rounds = [];

      if (this.selectedTournamentData.scramble) {
        // Scramble: Initialize only one round per track for the entire team
        const firstGolfer = this.selectedTeam.golfers[0];
        const division = this.selectedTournamentData.divisions.find(
          (d) =>
            d.name.trim().toLowerCase() === firstGolfer.division?.trim().toLowerCase() ||
            d.name.trim().toLowerCase() === firstGolfer.role?.trim().toLowerCase(),
        );

        if (division) {
          // Primary Round
          const primaryRound = this.createRound(firstGolfer, division, true);
          if (primaryRound) {
            primaryRound.golfer_name = this.selectedTeam.name;
            this.rounds.push(primaryRound);
          }

          // Secondary Round
          if (division.secondary_track_id != null && division.secondary_track_id !== 0) {
            const secondaryRound = this.createRound(firstGolfer, division, false);
            if (secondaryRound) {
              secondaryRound.golfer_name = this.selectedTeam.name;
              this.rounds.push(secondaryRound);
            }
          }
        }
      } else {
        for (const golfer of this.selectedTeam.golfers) {
          // Find division by name (case-insensitive)
          const division = this.selectedTournamentData.divisions.find(
            (d) =>
              d.name.trim().toLowerCase() === golfer.division?.trim().toLowerCase() ||
              d.name.trim().toLowerCase() === golfer.role?.trim().toLowerCase(),
          );

          if (division) {
            // Primary Round
            const primaryRound = this.createRound(golfer, division, true);
            if (primaryRound) {
              this.rounds.push(primaryRound);
            }

            // Secondary Round (if 18 holes)
            if (division.secondary_track_id != null && division.secondary_track_id !== 0) {
              const secondaryRound = this.createRound(golfer, division, false);
              if (secondaryRound) {
                this.rounds.push(secondaryRound);
              }
            }
          }
        }
      }
    }
    this.updateTeamRounds();
  }

  private ensureHandicapStrokes(round: RoundData): RoundData {
    // Deep copy and ensure handicap strokes are populated for existing rounds
    const r = { ...round, holes: round.holes.map((h) => ({ ...h })) };
    for (const hole of r.holes) {
      if (hole.handicap_strokes == null) {
        hole.handicap_strokes = this.computeHandicapStrokes(
          hole.stroke_index,
          r.golfer_playing_handicap,
        );
      }
    }
    return r;
  }

  private createRound(
    golfer: TournamentTeamGolfer,
    division: DivisionData,
    isPrimary: boolean,
  ): RoundData | null {
    if (!this.course) return null;

    const trackId = isPrimary ? division.primary_track_id : division.secondary_track_id;
    const teeId = isPrimary ? division.primary_tee_id : division.secondary_tee_id;

    if (trackId == null || trackId === 0) return null;

    const track = this.course.tracks.find((t) => t.id == trackId);
    if (!track) return null;

    const tee = track.tees.find((t) => t.id == teeId);
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
    return (
      Math.floor((playingHandicap * 2) / 18) + ((playingHandicap * 2) % 18 >= strokeIndex ? 1 : 0)
    );
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

    let roundsInput: RoundInput[] = [];

    if (this.selectedTournamentData.scramble) {
      // Scramble: Submit a single team round for all golfers
      const golferIds = this.selectedTeam!.golfers.map((golfer) => golfer.golfer_id);
      for (const teamRound of this.rounds) {
        roundsInput.push({
          team_id: this.selectedTeam!.team_id,
          golfer_ids: golferIds,
          golfer_playing_handicap: teamRound.golfer_playing_handicap,
          course_id: teamRound.course_id,
          track_id: teamRound.track_id,
          tee_id: teamRound.tee_id,
          holes: teamRound.holes.map((h) => ({
            hole_id: h.hole_id,
            gross_score: h.gross_score,
          })),
        });
      }
    } else {
      roundsInput = this.rounds.map((round) => ({
        team_id: round.team_id!,
        golfer_ids: [round.golfer_id],
        golfer_playing_handicap: round.golfer_playing_handicap,
        course_id: round.course_id,
        track_id: round.track_id,
        tee_id: round.tee_id,
        holes: round.holes.map((h) => ({
          hole_id: h.hole_id,
          gross_score: h.gross_score,
        })),
      }));
    }

    const tournamentInput: TournamentInput = {
      tournament_id: this.selectedTournamentData.id,
      date_played: this.selectedTournamentData.date,
      rounds: roundsInput,
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
        // Refresh full tournament data to show updated submission status
        if (this.selectedTournamentInfo) {
          this.tournamentsService.getTournament(this.selectedTournamentInfo.id);
        }
        this.selectedTeam = null;
        this.rounds = [];
        this.teamRounds.clear();
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

  getTrackTeamRound(trackId: number): RoundData {
    return this.teamRounds.get(trackId) || this.calculateTeamRound(trackId);
  }

  private calculateTeamRound(trackId: number): RoundData {
    const rounds = this.getRoundsForTrack(trackId);
    if (rounds.length === 0) {
      // Return a dummy round data if no rounds are found
      return {
        round_id: -1,
        date_played: new Date(),
        round_type: 'Tournament',
        golfer_id: -1,
        golfer_name: 'n/a',
        course_id: -1,
        course_name: 'n/a',
        track_id: trackId,
        track_name: 'n/a',
        tee_id: -1,
        tee_name: 'n/a',
        tee_gender: 'n/a',
        tee_rating: 0,
        tee_slope: 0,
        tee_par: 0,
        tee_color: 'n/a',
        gross_score: 0,
        adjusted_gross_score: 0,
        net_score: 0,
        holes: [],
      };
    }
    const teamFirstRound = rounds[0];
    const playingHandicap = this.selectedTournamentData?.scramble
      ? teamFirstRound.golfer_playing_handicap
      : undefined;

    const teamRound: RoundData = {
      round_id: -1,
      team_id: teamFirstRound.team_id,
      date_played: this.selectedTournamentData!.date,
      round_type: 'Tournament',
      golfer_id: -1,
      golfer_name: teamFirstRound.team_name || 'n/a',
      golfer_playing_handicap: playingHandicap,
      team_name: teamFirstRound.team_name,
      course_id: teamFirstRound.course_id,
      course_name: teamFirstRound.course_name,
      track_id: teamFirstRound.track_id,
      track_name: teamFirstRound.track_name,
      tee_id: teamFirstRound.tee_id,
      tee_name: teamFirstRound.tee_name,
      tee_gender: teamFirstRound.tee_gender,
      tee_rating: teamFirstRound.tee_rating,
      tee_slope: teamFirstRound.tee_slope,
      tee_par: this.selectedTournamentData?.bestball
        ? this.selectedTournamentData.bestball * teamFirstRound.tee_par
        : teamFirstRound.tee_par,
      tee_color: teamFirstRound.tee_color,
      gross_score: 0,
      adjusted_gross_score: 0,
      net_score: 0,
      holes: this.createHoleResultDataForTeam(rounds, playingHandicap),
    };
    return teamRound;
  }

  private updateTeamRounds(): void {
    this.teamRounds.clear();
    for (const trackId of this.uniqueTrackIds) {
      this.teamRounds.set(trackId, this.calculateTeamRound(trackId));
    }
  }

  private createHoleResultDataForTeam(
    rounds: RoundData[],
    playingHandicap: number | undefined,
  ): HoleResultData[] {
    const holeResultData: HoleResultData[] = [];
    if (rounds.length === 0) return [];

    for (let holeIdx = 0; holeIdx < rounds[0].holes.length; holeIdx++) {
      const hole = rounds[0].holes[holeIdx];
      let holePar = hole.par;
      let grossScore = 0;
      let netScore = 0;
      if (this.selectedTournamentData?.bestball === 2) {
        holePar = hole.par * 2;
        const grossScores = rounds
          .map((r) => r.holes[holeIdx].gross_score)
          .sort((a, b) => a - b)
          .slice(0, 2);
        grossScore = grossScores.length === 2 ? grossScores[0] + grossScores[1] : 0;

        const netScores = rounds
          .map((r) => r.holes[holeIdx].gross_score - r.holes[holeIdx].handicap_strokes)
          .sort((a, b) => a - b)
          .slice(0, 2);
        netScore = netScores.length === 2 ? netScores[0] + netScores[1] : 0;
      } else if (this.selectedTournamentData?.bestball === 1) {
        grossScore = Math.min(...rounds.map((r) => r.holes[holeIdx].gross_score || 99));
        netScore = Math.min(
          ...rounds.map(
            (r) => (r.holes[holeIdx].gross_score || 99) - r.holes[holeIdx].handicap_strokes,
          ),
        );
      } else if (this.selectedTournamentData?.scramble) {
        grossScore = rounds[0].holes[holeIdx].gross_score;
        netScore = grossScore - rounds[0].holes[holeIdx].handicap_strokes;
      } else {
        // Default to sum if not specified
        grossScore = rounds.reduce((sum, r) => sum + r.holes[holeIdx].gross_score, 0);
        netScore = rounds.reduce(
          (sum, r) => sum + (r.holes[holeIdx].gross_score - r.holes[holeIdx].handicap_strokes),
          0,
        );
      }

      holeResultData.push({
        hole_result_id: -1,
        round_id: -1,
        tee_id: hole.tee_id,
        hole_id: hole.hole_id,
        number: hole.number,
        par: holePar,
        yardage: hole.yardage,
        stroke_index: hole.stroke_index,
        handicap_strokes: this.computeHandicapStrokes(hole.stroke_index, playingHandicap),
        gross_score: grossScore === 99 ? 0 : grossScore,
        adjusted_gross_score: 0,
        net_score: netScore >= 90 ? 0 : netScore,
      });
    }
    return holeResultData;
  }

  onRoundChange(): void {
    // Trigger change detection for team round rollup
    this.rounds = [...this.rounds];
    this.updateTeamRounds();
  }
}
